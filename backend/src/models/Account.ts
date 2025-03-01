import mongoose from "mongoose";

const Schema = mongoose.Schema;

const AccountSchema = new Schema({
    User: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

export default mongoose.model('Account', AccountSchema);