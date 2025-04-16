// Sidebar.jsx
import { useQuery } from '@tanstack/react-query';
import { getUserChats, deleteChat, renameChat } from '../api/chat'; 
import { useNavigate, useParams } from 'react-router-dom';
import { queryClient } from '../main';
import { toast } from 'react-hot-toast';
import { flushSync } from 'react-dom';
import { useState } from 'react';

const Sidebar = () => {
  const navigate = useNavigate();
  const { chatId: activeChatId } = useParams();

  const { data: chats, isLoading } = useQuery({
    queryKey: ['chats'],
    queryFn: getUserChats,
  });

  const handleNewChat = async () => {
    navigate('/chat'); // default new chat view, doesn't send until first message
  };

  const handleChatClick = (chatId) => {
    navigate(`/chat/${chatId}`);
  };
  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    const confirmDelete = window.confirm('Are you sure you want to delete this chat?');
  
    if (confirmDelete) {
      try {
        await deleteChat(chatId);
        if (chatId === activeChatId) {
          flushSync(() => {
            navigate('/chat');
          }); // go to default new chat view
        }
        
  
        await queryClient.invalidateQueries(['chats']);
        toast.success('Chat deleted successfully');
  
        // Redirect if the deleted chat is the one currently active
       
      } catch (e) { 
        console.error('Error deleting chat:', e);
        toast.error('Failed to delete chat');
      }
    }
  };

const [editingChatId, setEditingChatId] = useState(null);
const [editedName, setEditedName] = useState('');

const handleRenameClick = (chat) => {
  setEditingChatId(chat._id);
  setEditedName(chat.name);
};

const handleRenameSubmit = async (e, chatId) => {
  e.preventDefault();
  if (!editedName.trim()) return;

  try {
    await renameChat(chatId, editedName.trim());
    await queryClient.invalidateQueries(['chats']);
    toast.success('Chat renamed');
  } catch (err) {
    console.error('Error renaming chat:', err);
    toast.error('Rename failed');
  } finally {
    setEditingChatId(null);
    setEditedName('');
  }
};

  return (
    <div className="h-full p-4 flex flex-col">
      <button
        onClick={handleNewChat}
        className="bg-blue-500 text-white py-2 px-4 rounded mb-6 w-full"
      >
        + New Chat
      </button>

      <h2 className="text-lg font-semibold mb-4">Your Chats</h2>

      {isLoading ? (
        <p>Loading chats...</p>
      ) : chats?.length === 0 ? (
        <p>No chats yet</p>
      ) : (
        <ul className="space-y-2 overflow-y-auto">
          {[...chats].reverse().map((chat) => (
            <li
            key={chat._id}
            onClick={() => handleChatClick(chat._id)}
            className={`cursor-pointer p-2 rounded transition ${
              chat._id === activeChatId ? 'bg-blue-100 font-semibold' : 'hover:bg-gray-200'
            }`}
          >
            <div className="flex justify-between items-center">
              {editingChatId === chat._id ? (
                <form
                  onSubmit={(e) => handleRenameSubmit(e, chat._id)}
                  className="flex-1"
                >
                  <input
                    autoFocus
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onBlur={(e) => handleRenameSubmit(e, chat._id)}
                    className="bg-white border p-1 rounded w-full"
                  />
                </form>
              ) : (
                <span>{chat.name || 'Untitled Chat'}</span>
              )}
        
              <div className="flex items-center gap-2 ml-2">
                <img
                  src="/image copy.png"
                  alt="rename"
                  className="w-7 h-7 object-contain cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRenameClick(chat);
                  }}
                />
                <img
                  src="/image.png"
                  alt="delete"
                  className="w-8 h-8 object-contain cursor-pointer"
                  onClick={(e) => handleDeleteChat(chat._id, e)}
                />
              </div>
            </div>
          </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;