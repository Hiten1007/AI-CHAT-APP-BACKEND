import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Home from './pages/Home';
 import Auth from './pages/Auth';
import ChatPage from './pages/ChatPage';
import { Toaster } from 'react-hot-toast';

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/chat" /> : <Home authUser={user} />} />
         <Route path="/auth" element={user ? <Navigate to="/chat" /> : <Auth />} />
         <Route path="/chat" element={user ? <ChatPage /> : <Navigate to="/" />} /> 
        <Route path="/chat/:chatId" element={user ? <ChatPage /> : <Navigate to="/" />} /> 
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;