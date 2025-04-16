import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMessages, sendMessage, createChat, readAloud } from '../api/chat';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';

const ChatWindow = () => {
  const { chatId } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [localMessages, setLocalMessages] = useState([]); // ⚡️ local state for instant user message
  const [aiTyping, setAiTyping] = useState(false); // ⚡️ show "Typing..." while AI responds
  const bottomRef = useRef(null);

  const { data: messages = [] } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => getMessages(chatId),
    enabled: !!chatId,
  });

  const sendMutation = useMutation({
    mutationFn: async ({ content }) => {
      setAiTyping(true); // ⚡️ Start typing state

      if (!chatId) {
        const newChat = await createChat(content.slice(0, 20) || 'Untitled Chat');
        navigate(`/chat/${newChat._id}`);
        const msg = await sendMessage(content, newChat._id);
        return msg;
      } else {
        return sendMessage(content, chatId);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', chatId]);
      queryClient.invalidateQueries(['chats']);
      setLocalMessages([]); // ⚡️ clear instant messages
      setAiTyping(false); // ⚡️ Done typing
    },
    onError: () => {
      toast.error('Failed to send message');
      setAiTyping(false);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      _id: Date.now(), // temp id
      sender: 'user',
      content: input.trim(),
    };

    setLocalMessages((prev) => [...prev, userMessage]); // ⚡️ Show immediately
    sendMutation.mutate({ content: input });
    setInput('');
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => toast.success('Copied to clipboard!'))
      .catch(() => toast.error('Failed to copy'));
  };

  const handleReadAloud = async (text) => {
    if (!text) {
      toast.error("No text to read.");
      return;
    }
  
    try {
      const audioContent = await readAloud(text)
  
      const audio = new Audio(`data:audio/mp3;base64,${audioContent}`);
      audio.play();
  
      toast.success("Reading aloud...");
    } catch (error) {
      console.error("TTS Error:", error);
      toast.error("Failed to read aloud.");
    }
  };
  
  

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, localMessages, aiTyping]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {(messages.length === 0 && localMessages.length === 0) ? (
          <div className="text-gray-500 text-center mt-4 p-4 bg-gray-100 rounded max-w-[60%] mx-auto">
            What would you like to ask today?
          </div>
        ) : (
          [...messages, ...localMessages].map((msg) => (
            <div
              key={msg._id}
              className={`mb-2 p-3 rounded max-w-[70%] ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white self-end ml-auto text-right'
                  : 'bg-gray-200 text-black self-start mr-auto text-left'
              }`}
            >
              <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
              {msg.content}
              </ReactMarkdown>
              {msg.sender === 'ai' && (
                <div className="flex gap-1 mt-1">
                  <img
                    src="/image copy 2.png"
                    className="w-9 h-9 object-contain cursor-pointer"
                    onClick={() => handleCopy(msg.content)}
                    title="Copy to clipboard"
                  />
                  <img
                    src="/image copy 3.png"
                    className="w-8 h-8 object-contain cursor-pointer"
                    onClick={() => handleReadAloud(msg.content)}
                    title="Read aloud"
                  />
                </div>
              )}
            </div>
          ))
        )}

        {aiTyping && (
          <div className="bg-gray-200 text-black self-start mr-auto text-left mb-2 p-3 rounded max-w-[70%] animate-pulse">
            AI is typing...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-4 border-t flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
