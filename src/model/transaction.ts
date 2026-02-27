import mongoose, {Model, Schema, Document, model } from 'mongoose'

export enum TransactionType {

    WITHDRAW = 'withdraw',
    DEPOSIT = 'deposit',
    TRANSFER = 'transfer'
}

export enum TransactionStatus {
    PENDING = 'pending',
    SUCCESS = 'success',
    FAILED = 'failed'
}


export interface ITransaction extends Document {
    senderId: mongoose.Types.ObjectId,
    receiverId: mongoose.Types.ObjectId,
    amount: number,
    type: TransactionType,
    status: TransactionStatus,
    reference: string
}

const TransactionSchema: Schema<ITransaction> = new Schema ({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',

        // required only if the transaction type is transfer
        required: function () {return this.type === TransactionType.TRANSFER}
    },
     
    receiverId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
        required: true
    },

    amount: {
        type: Number,
        required: true,
        min: [50, 'Amount must be atleast 50 Naira']    // amount must be 50 above
    },

    type: {
        type: String,
        enum: Object.values(TransactionType), // uses enum values
        required: true
    },

    status: {
        type: String,
        enum: Object.values(TransactionStatus),
        default: TransactionStatus.PENDING // start transfer at pending
    },

    reference: {
        type: String,
        required: true,
        unique: true,
        index: true
    }
}, {timestamps: true})


const Transaction: Model<ITransaction> = mongoose.model<ITransaction>('Transaction', TransactionSchema)

export default Transaction;