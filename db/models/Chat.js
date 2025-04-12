import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});


export default mongoose.model('Chat', ChatSchema);