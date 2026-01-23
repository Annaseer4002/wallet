import mongoose, { Document, Schema, Model } from "mongoose";


interface IUser extends Document {
    walletId: mongoose.Types.ObjectId;
    username: string;
    phoneNumber: string;
    email: string;
    password: string;
    isVerified: boolean;
    otpCode?: string;
    otpExpiresAt?: Date;
    otpResendCount: Date[];
    createdAt: Date;
    updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema({
    walletId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Wallet',
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    otpCode: {
        type: String,
        required: false
    },
    otpExpiresAt: {
        type: Date,
        required: false
    },

    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now
    },

    otpResendCount: {
        type: [Date],
        required: false,
        default: []
    }

}, { timestamps: true });


const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;