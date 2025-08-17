import { Hono } from "hono";
import { tokenRefresh } from "../controller/tokenController";


export const tokenRouter = new Hono();

tokenRouter.post('/refresh', tokenRefresh)