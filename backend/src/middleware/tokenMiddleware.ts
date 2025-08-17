import { Context, Next } from "hono";
import jwt from 'jsonwebtoken';


export const authenticateToken = async (c: Context, next: Next) => {
    const authHeader = c.req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return c.json({ error: 'Access token required' }, 401);
    }

    try {
        const decoded = jwt.verify(token, c.env.ACCESS_SECRET) as { userId: string };
        c.set('userId', decoded.userId);
        await next();
    }
    catch (error) {
        return c.json({ error: 'Invalid or expired token' }, 401)
    }
}