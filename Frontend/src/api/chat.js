import axiosInstance from "../lib/axios";


export const getUserChats = async () => {
  const res = await axiosInstance.get('/api/chat/', { withCredentials: true });
  return res.data;
};

export const getMessages = async (chatId) => {
    const res = await axiosInstance.get(`/api/chat/${chatId}`, { withCredentials: true });
    return res.data.messages;
  };
  
export const sendMessage = async (content, chatId) => {
    
  const res = await axiosInstance.post(
      `/api/chat/send`,
      { content, chatId },
      { withCredentials: true }
  );
  return res.data;
};

export const createChat = async (name) => {
  const res = await axiosInstance.post(
      `/api/chat/new`,
      { name },
      { withCredentials: true }
  );
  return res.data;
}

export const deleteChat = async (chatId) => {
  const res = await axiosInstance.delete(`/api/chat/${chatId}`, { withCredentials: true });
  return res.data;
}

export const renameChat = async (chatId, name) => {
  const res = await axiosInstance.put(
      `/api/chat/rename`,
      { chatId, name },
      { withCredentials: true }
  );
  return res.data;
}


export const readAloud = async (text) => {
  const res = await axiosInstance.post(
      `/api/chat/tts`,
      { text},
      { withCredentials: true }
  );
  return res.data.audioContent;
}