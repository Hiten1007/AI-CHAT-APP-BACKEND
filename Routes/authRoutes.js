import { Router } from "express";
import { signUp, logIn } from "../controllers/authControllers.js"
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.post('/signup', signUp);
router.post('/login', logIn);
router.get('/me', verifyToken, (req, res) => {
    res.status(200).json({ user: req.user });
});
  

export default router;