import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";
import { signinSchema, signupSchema } from "../zod/userSchema";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
        return c.json({ error: `Internal server error: ${error}` }, 500);
    }
}


export async function signin(c: Context) {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const body: {
        email: string,
        password: string
    } = await c.req.json();


    try {
        const parsePayload = signinSchema.safeParse(body);

        if (!parsePayload.success) {
            return c.json({ error: "Invalid inputs" }, 400);
        }

        const isUserExist = await prisma.user.findUnique({
            where: {
                email: body.email,
            }
        });

        if (isUserExist == null) {
            return c.json({ error: "User doesn't exist" }, 402)
        }

        //compare password
        const isPasswordCorrect = await bcrypt.compare(body.password, isUserExist.password);

        if (!isPasswordCorrect) {
            return c.json({ error: "Invalid credentials" }, 401);
        }

        const userId = isUserExist?.id;
        const accessToken = jwt.sign({ userId }, `${c.env.ACCESS_SECRET}`, { expiresIn: "30s" });
        const refreshToken = jwt.sign({ userId }, `${c.env.REFRESH_SECRET}`, { expiresIn: "7d" });

        return c.json({
            msg: "Signin successfull",
            accessToken: accessToken,
            refreshToken: refreshToken,
        });
    }
    catch (error) {
        return c.json({ error: `Internal server error: ${error}` }, 500)
    }
}

export async function profile(c: Context) {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const userId = c.get('userId');

    try {
        const profile = await prisma.user.findUnique({
            where: {
                id: userId
            }
        });


        return c.json({
            firstName: profile?.firstName,
            lastName: profile?.lastName
        });
    }
    catch(error){
        return c.json({ error: `Unable to fetch data: ${error}`}, 500)
    }
}