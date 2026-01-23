import { Router } from 'express';
import router from './user.js';
const rootRouter = Router();

rootRouter.use('/user', router);

export default rootRouter;