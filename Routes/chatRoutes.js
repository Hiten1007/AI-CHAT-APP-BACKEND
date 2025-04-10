import Router from 'express'
import { sendMessage, getMesaages, deleteChat } from '../controllers/chatControllers.js';
import verifyToken from '../middlewares/verifyToken.js';
const router = Router();

router.use(verifyToken);

router.post('/:chatId', sendMessage);

router.get('/chat', getMesaages);

router.delete('/:chatId', deleteChat);

export default router;