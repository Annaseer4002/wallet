import mongoose, {Schema, Model, Document } from 'mongoose'

export interface IBlackList extends Document {
    token: string;
    expiresAt: Date;
}

const BlacklistSchema: Schema<IBlackList> = new Schema({
    token: { type: String, required: true, unique: true },
    expiresAt: {  
         type: Date,
         default: Date.now,
         expires: 3600
        } // Token expires after 1 hour
}, {
    timestamps: true
});

const Blacklist: Model<IBlackList> = mongoose.model<IBlackList>('Blacklist', BlacklistSchema);

export default Blacklist;