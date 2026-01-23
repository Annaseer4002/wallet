import mongoose, { Schema, Model, Document } from "mongoose"


type walletStatus = 'active' | 'frozen' | 'banned' | 'inActive';

interface IWallet extends Document {
    userId: mongoose.Types.ObjectId;
    balance: number;
    pinCode?: string;
    status: walletStatus
}




const walletSchema:  Schema<IWallet> = new Schema ({
    userId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true,
         unique: true
    },

    balance: {
        type: Number,
        required: true,
        default: 0
    },

    status: {
        type: String,
        enum: ['active', 'frozen', 'banned', 'inActive'],
        default: 'inActive'
    },

    pinCode: {
        type: String,
        required: false
    }
}, {timestamps: true})



const Wallet: Model<IWallet> = mongoose.model<IWallet>('Wallet', walletSchema)
export default Wallet 