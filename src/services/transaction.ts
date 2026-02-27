import mongoose from "mongoose";
import Transaction, { TransactionStatus, TransactionType } from "../model/transaction.js";
import User from "../model/user.js"
import Wallet from "../model/wallet.js"
import { customAlphabet } from "nanoid";

// generate reference
const generateReference = customAlphabet('ABDULNASIR12345678910BADAMASI', 12)


export const sendMoney = async (senderId: string, receiverId: string, amount: number) => {
    
    // start session
   const session =  await mongoose.startSession()

   try {

    // start the transaction
       session.startTransaction()

          // fetch wallet within session
    const senderWallet = await Wallet.findOne({ userId: senderId }).session(session);
    const receiverWallet = await Wallet.findOne({ userId: receiverId }).session(session);


    // check if the sender exist
    if(!senderWallet){
        throw new Error('Sender wallet not found')
    }

    // if the receiver`s account exist
    if(!receiverWallet){
        throw new Error('Receiver account does not exist')
    }

    // confirm the sender is not sending to himself
    if(senderId === receiverId){
        throw new Error('Cannot transfer to one-self')
    }



    // check balance
    if(senderWallet?.balance < amount){
        throw new Error('Insufficient Funds.')
     }

    // subtract from sender`s balance and add to the receiver
    senderWallet.balance -= amount
    receiverWallet.balance += amount

    // save both wallet within session
    await senderWallet.save({session})
    await receiverWallet.save({session})


    // create record, with reference
    const reference = generateReference()


   const transaction = new Transaction({
         senderId,
         receiverId,
         amount,
         reference,
         type: TransactionType.TRANSFER,
         status: TransactionStatus.SUCCESS
   })
    
   //save transaction
   await transaction.save({session})


   // commit the changes    
   await session.commitTransaction()

   return {success: true, reference}



   } catch (error: any) {

    // if anything goes wrong, UNDO everything
       await session.abortTransaction()
       throw new Error(error.message)
   } finally {

    // end the session
    session.endSession()
   }
    
 

    
}


export const creditWallet = async (userId: string, amount: number) => {
    // start session
    const session = await mongoose.startSession()

    try {

        // start transaction
        session.startTransaction()

        // fetch wallet within session
        const wallet = await Wallet.findOne({ userId }).session(session)
        
        // if wallet not found, throw error
        if(!wallet){
            throw new Error('Wallet not found')
        }


        // add amount to wallet balance
        wallet.balance += amount
        await wallet.save({session})
        

        // create transaction record with reference
        const reference = generateReference()
        const transaction = new Transaction({
            senderId: null,
            receiverId: userId,
            amount,
            reference,
            type: TransactionType.DEPOSIT,
            status: TransactionStatus.SUCCESS
        })

        // save transaction
        await transaction.save({session})

        // commit the changes
        await session.commitTransaction()
        
        return { success: true, reference }
    } catch(error: any) {

        // if anything goes wrong, UNDO everything
        await session.abortTransaction()
        throw new Error(error.message)
    } finally {
        session.endSession()
    }
}

export const getMyTransactions = async (userId: string) => {
    try {

        const transactions = await Transaction.find({ 
            $or: [{ senderId: userId }, { receiverId: userId }] 
        })

        // if no transactions found, throw error
        if(!transactions || transactions.length === 0){
            throw new Error('No transactions found for this user')
        }
    return transactions
        
    } catch (error) {
        throw new Error('Could not fetch transactions')
    }
   
}

export const getTransactionByRefrence = async (reference: string) => {
    try {

        // find transaction by reference
        const transaction = await Transaction.findOne({reference})

        // if transaction not found, throw error
        if(!transaction){
             throw new Error('Transaction not found')
        }

        // 
        return transaction
    }catch (error){
        throw new Error('Could not fetch transaction with the provided reference')
    }
}


const transactionService = {
    sendMoney,
    creditWallet,
    getMyTransactions,
    getTransactionByRefrence
}

export default transactionService