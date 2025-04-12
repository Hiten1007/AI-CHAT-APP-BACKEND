import Router from 'express'
import { sendMessage, getMesaages, deleteChat, getUserChats, createChat, renameChat, readAloud } from '../controllers/chatControllers.js';
import verifyToken from '../middlewares/verifyToken.js';
const router = Router();

router.use(verifyToken);


router.get('/', getUserChats)
router.post('/new', createChat)
router.put('/rename', renameChat);
router.post('/tts', readAloud);

router.post('/send', sendMessage);
router.get('/:chatId', getMesaages);
router.delete('/:chatId', deleteChat);

export default router;