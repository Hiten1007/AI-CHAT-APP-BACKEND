import axios from 'axios';
import { Chat, Message } from '../db/models/db.js';

export const sendMessage = async (req, res) => {
  const { message, chatId } = req.body;
  const userId = req.user.id; 

  try {
    let chat;

    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, user: userId }).populate('messages');
      if (!chat) return res.status(404).json({ error: 'Chat not found' });
    } else {
      chat = await Chat.create({ user: userId, messages: [] });
    }

   
    const userMessage = await Message.create({
      chat: chat._id,
      sender: 'user',
      content: message,
    });

    chat.messages.push(userMessage._id);
    await chat.save();

    const response = await axios.post(
      "https://flow.newgensoftware.net/api/v1/run/ffb49b2a-4ef0-48b0-8dd4-f04c2b0d6843?stream=false",
      {
        input_value: message,
        output_type: "chat",
        input_type: "chat",
        tweaks: {
          "Agent-2cb01": {},
          "ChatInput-FGrlI": {},
          "ChatOutput-7qKFQ": {},
          "URL-pemic": {},
          "CalculatorComponent-WJ5Vd": {},
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FLOW_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiResponse = response.data.output_value || "No response from AI";

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
