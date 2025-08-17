import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { userRouter } from './router/userRouter';
import { tokenRouter } from './router/tokenRouter';

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
    // Add other environment variables you use
  }
}>()

app.use(cors());

app.route('/api/v1/user', userRouter);
app.route('/api/v1/token', tokenRouter);

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
export type AppType = typeof app
