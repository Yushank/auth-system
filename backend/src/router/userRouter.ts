import { Hono } from "hono";
import { profile, signin, signup } from "../controller/userController";
import { authenticateToken } from "../middleware/tokenMiddleware";


export const userRouter = new Hono();

userRouter.post('/signup', signup);
userRouter.post('/signin', signin);
userRouter.get('/profile', authenticateToken, profile);
