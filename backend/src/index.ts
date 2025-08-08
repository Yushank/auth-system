import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { userRouter } from './router/userRouter';

const app = new Hono()

app.use(cors());

app.route('/api/v1/user', userRouter);

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
