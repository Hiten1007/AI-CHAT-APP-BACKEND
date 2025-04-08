import express from 'express';
import {config} from 'dotenv';
import connectDB from './db/config/db.js';

config();

const app = express();

app.use(express.json());

connectDB()

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});