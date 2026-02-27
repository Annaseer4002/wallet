import { Router } from 'express';
import router from './user.js'
import transactionRouter from './transaction.js'

const rootRouter = Router();

rootRouter.use('/user', router);
rootRouter.use('/transaction', transactionRouter);

export default rootRouter;