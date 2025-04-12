import axios from 'axios';
import { Chat, Message } from '../db/models/db.js';

export const createChat = async (req, res) => {
  const userId = req.user.id;
  const { name } = req.body;

  try {
    const chat = await Chat.create({
      user: userId,
      messages: [],
      name: name || 'Untitled Chat',
    });

    res.status(201).json(chat);
  } catch (err) {
    console.error('❌ Error creating chat:', err.message);
    res.status(500).json({ error: 'Failed to create chat' });
  }
};

export const sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  const userId = req.user.id; 

  try {
    const chat = await Chat.findOne({ _id: chatId, user: userId });
    if (!chat) return res.status(404).json({ error: 'Chat not found' });

    const userMessage = await Message.create({
      chat: chat._id,
      sender: 'user',
      content: content,
    });

    chat.messages.push(userMessage._id);
    await chat.save();

   

    async function chatCall(message, LANGFLOW_URL, LANGFLOW_TOKEN) {
      try {
        // Set the API key conditionally
        const headers = {
          "Content-Type": "application/json",
          // ...(username === "Shubham" ? { "x-api-key": user.LANGFLOW_TOKEN } : { Authorization: `Bearer ${user.LANGFLOW_TOKEN}` }),
          "x-api-key": LANGFLOW_TOKEN,
        };
    
        const response = await axios.post(
          LANGFLOW_URL,
          {
            input_value: message,
            output_type: "chat",
            input_type: "chat",
            tweaks: {
              "ChatInput-ebdIv": {},
              "Agent-8jHJg": {},
              "ChatOutput-uvwsK": {},
              "Prompt-ogXvn": {},
              "AstraDBToolComponent-5QRJp": {},
            },
          },
          { headers }
        );
        if (response.status === 200 && response.data) {
          const responseData = response.data.outputs[0].outputs[0].results.message.text;

          return responseData; 
        } else {
          return { AIResponse: `Failed to get response, status code: ${response.status}` };
        }
      } catch (e) {
        return { AIResponse: `Failed to process message, error: ${e.message}` };
      }
    }
      


    const aiResponse = await chatCall(content, "https://flow.newgensoftware.net/api/v1/run/ffb49b2a-4ef0-48b0-8dd4-f04c2b0d6843?stream=false", process.env.FLOW_API_KEY);

    // 💬 Save AI response
    const botMessage = await Message.create({
      chat: chat._id,
      sender: 'ai',
      content: aiResponse,
    });

    chat.messages.push(botMessage._id);
    await chat.save();

    res.status(200).json({
      chatId: chat._id,
      messages: [
        { sender: 'user', content: userMessage.content },
        { sender: 'ai', content: botMessage.content },
      ],
      name: chat.name,
    });
    
  

  } catch (err) {
    console.error('❌ Error in sendMessage:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMesaages = async (req, res) => {
    const { chatId } = req.params;
    const userId = req.user.id;
  
    if (!chatId) {
      return res.status(400).json({ error: 'Chat ID is required' });
    }
  
    try {
      const chat = await Chat.findOne({ _id: chatId, user: userId }).populate('messages');
  
      if (!chat) {
        return res.status(404).json({ error: 'Chat not found' });
      }
  
      res.status(200).json({ messages: chat.messages });
    } catch (err) {
      console.error('❌ Error in getMessages:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    }  
};



export const deleteChat = async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user.id;

  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    if (chat.user.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this chat' });
    }

    // Delete associated messages
    await Message.deleteMany({ chat: chatId });

    // Delete the chat
    await chat.deleteOne();

    res.status(200).json({ message: 'Chat deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting chat', error: err.message });
  }
};

export const getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;

    const chats = await Chat.find({ user: userId })
      .select('-messages') // Exclude messages field
      .sort({ updatedAt: -1 }); // Optional: newest chats first

    res.status(200).json(chats);
  } catch (err) {
    console.error('Error getting chats:', err);
    res.status(500).json({ message: 'Failed to fetch chats' });
  }
};

export const renameChat = async (req, res) => {

  const { chatId, name } = req.body;
  const userId = req.user.id;

  try { 
    const chat = await Chat.findOne({ _id: chatId, user: userId });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    chat.name = name;
    await chat.save();

    res.status(200).json(chat);
  }
  catch (err) {
    console.error('❌ Error renaming chat:', err.message);
    res.status(500).json({ error: 'Failed to rename chat' });
  }
}

export const readAloud = async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  try {
    const response = await axios.post(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_API_KEY}`,
      {
        input: { text },
        voice: {
          languageCode: 'en-US',
          ssmlGender: 'NEUTRAL',
        },
        audioConfig: {
          audioEncoding: 'MP3',
        },
      }
    );

    res.json({ audioContent: response.data.audioContent });
  } catch (err) {
    console.error('Error with TTS request:', err);
    res.status(500).json({ error: 'TTS failed' });
  }
};
