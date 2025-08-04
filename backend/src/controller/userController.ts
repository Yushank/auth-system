import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";
import { signupSchema } from "../zod/userSchema";
import bcrypt from "bcryptjs";

export async function signup(c: Context) {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body: {
        firstName: string,
        lastName: string,
        email: string,
        password: string
    } = await c.req.json();

    try {
        const parsePayload = signupSchema.safeParse(body);

        if (!parsePayload.success) {
            return c.json({ error: "Invalid inputs" }, 400);
        }

        const data = parsePayload.data;

        const isUserExist = await prisma.user.findFirst({
            where: {
                email: data.email
            }
        });

        if (isUserExist) {
            return c.json({ error: "User already exists" }, 400);
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const res = await prisma.user.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: hashedPassword
            }
        });

        return c.json({
            msg: "User created successfully",
            user: {
                userId: res.id,
                firstName: res.firstName,
                lastName: res.lastName,
                email: res.email,
            }
        });
    }
    catch (error) {
        return c.json({error: `Internal server error: ${error}` }, 500);
    }
}