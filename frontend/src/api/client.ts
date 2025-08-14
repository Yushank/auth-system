import { hc } from "hono/client";
import {type AppType} from '../../../backend/src/index'

const client = hc<AppType>('http://127.0.0.1:8787');

export default client