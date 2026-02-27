import { Router } from "express";
import TransactionController from "../controllers/transaction.js" 
import authorizationMiddleware from "../middlewares/authorization.js";
import { validateBody } from "../middlewares/validation.js";
import TransactionDtos from "../dtos/transaction.js";
const router = Router();


router.post('/transfer', authorizationMiddleware.Authorization,
    validateBody(TransactionDtos.Transfer),
     TransactionController.sendMoney)

router.post('/credit', TransactionController.creditWallet)

router.get('/my-transactions', authorizationMiddleware.Authorization, TransactionController.getMyTransactions)

router.get('/transaction/:reference', TransactionController.getTransactionByReference)

export default router;     