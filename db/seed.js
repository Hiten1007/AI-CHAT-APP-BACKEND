import {User, Chat, Message} from './models/db.js';
import connectDB from './config/db.js';


connectDB();

const seed = async () => {
  await connectDB();

  const user = await User.create({ username: 'testuser1', password: 'passwAord123' });

  const chat = await Chat.create({ user: user._id, name: 'Test Chat' });

  const message = await Message.create({
    chat: chat._id,
    sender: 'user',
    content: 'Hello, AI!'
  });

  chat.messages.push(message._id);
  await chat.save();

  console.log('✅ Seeding complete');
  process.exit();
};

export default seed;