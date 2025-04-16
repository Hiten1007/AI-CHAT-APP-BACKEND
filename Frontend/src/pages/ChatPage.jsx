import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';


const ChatPage = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 border-r border-gray-300 bg-white">
        <Sidebar />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <ChatWindow />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;