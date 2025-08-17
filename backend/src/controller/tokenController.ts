import { Context } from "hono";
import jwt from 'jsonwebtoken';


export async function tokenRefresh(c: Context) {
    const { refreshToken } = await c.req.json();

    if (!refreshToken) {
        return c.json({ error: 'Refresh token required' }, 401);
    }

    try {
        const decoded = jwt.verify(refreshToken, c.env.REFRESH_SECRET) as { userId: string };

        const newAccessToken = jwt.sign({ userId: decoded.userId }, c.env.ACCESS_SECRET, { expiresIn: "30s" });

        return c.json({ accessToken: newAccessToken });
    }
    catch (error) {
        return c.json({ error: 'Invalid refresh token' }, 401);
    }
}