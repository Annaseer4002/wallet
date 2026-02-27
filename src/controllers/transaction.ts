import { Request, Response } from 'express'
import TransactionDtos from "../dtos/transaction.js"
import transactionService from "../services/transaction.js"
import { TokenPayload } from "../types/express.js"

export const sendMoney = async (req: Request, res: Response) => {
    try {
        const { amount, receiverId }: TransactionDtos.Transfer = req.body

        const user = req.user as TokenPayload
        if (!user || !user.userId) {
            return res.status(401).json({
                status: 'failed',
                message: 'Unauthenticated: sender not found'
            })
        }

        const senderId = user.userId.toString()

        const result = await transactionService.sendMoney(senderId, receiverId, amount)

        return res.status(200).json({ status: 'success', message: 'Transfer successful', data: result })
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error instanceof Error ? error.message : 'Internal Server Error' })
    }
}

export const creditWallet = async (req: Request, res: Response) => {
    try {
        const { userId, amount } = req.body

        if (!userId || !amount) {
            return res.status(400).json({
                status: 'failed',
                message: 'userId and amount are required'
            })
        }

        const result = await transactionService.creditWallet(userId, amount)

        return res.status(200).json({ status: 'success', message: 'Wallet credited successfully', data: result })
    } catch (error) {
        return res.status(500).json({ status: 'error', message: error instanceof Error ? error.message : 'Internal Server Error' })
    }
}



export const getMyTransactions = async (req: Request, res: Response) => {
    try {




        // get userId from token payload
        const user = req.user as TokenPayload

        // if user or userId is not found in t
        if(!user || !user.userId){
            return res.status(401).json({
                status: 'failed',
                message: 'Unauthenticated: user not found'
            })
        }

        // fetch transactions for the user

        const transactions = await transactionService.getMyTransactions(user.userId)
        return res.status(200).json({ status: 'success', data: transactions })

    } catch (error) {
        return res.status(500).json({ status: 'error', message: error instanceof Error ? error.message : 'Internal Server Error' })
    }
}

export const getTransactionByReference = async (req: Request, res: Response) => {
    try {
        const { reference } = req.params

        if (!reference) {
            return res.status(400).json({
                status: 'failed',
                message: 'Reference is required'
            })
        }

        const transaction = await transactionService.getTransactionByRefrence(reference.toString())
        return res.status(200).json({ status: 'success', data: transaction })

    } catch (error) {
        return res.status(500).json({ status: 'error', message: error instanceof Error ? error.message : 'Internal Server Error' })
    }
}

const TransactionController = { sendMoney, creditWallet, getMyTransactions, getTransactionByReference }
export default TransactionController