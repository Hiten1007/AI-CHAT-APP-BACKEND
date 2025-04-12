import express from 'express';
import {config} from 'dotenv';
import cors from 'cors';
import connectDB from './db/config/db.js';
import cookieParser from 'cookie-parser';
import authRoutes from './Routes/authRoutes.js'
import chatRoutes from './Routes/chatRoutes.js';

config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.use(cookieParser());

connectDB()

app.use('/api/auth', authRoutes);

app.use('/api/chat', chatRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});