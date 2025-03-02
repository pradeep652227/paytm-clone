import mongoose from 'mongoose';
import { TxnTypes, RequestStatus, TxnModes } from '../utils/customTypes';
import Counter from './Counter';

const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
    User: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currentBalance: {
        type: Number,
        required: true,
    },
    updatedBalance: Number,
    status: {
        type: String,
        enum: Object.values(RequestStatus),
        default: 'P'
    },
    remarks: String,
    txnType: {
        type: String,
        enum: Object.values(TxnTypes),
        required: true
    },
    txnMode : {
        type : String,
        enum : Object.values(TxnModes),
        required : true
    },
    txnId: {
        type: Number,
        unique: true
    }
}, { timestamps: true });

TransactionSchema.pre('validate', async function (next) {
    if (this.isNew) {
        const session = this.$session();
        const counter = await Counter.findOneAndUpdate({ name: 'transaction' },
            { $inc: { seq: 1 } }, { new: true, upsert: true, session });
        this.txnId = counter.seq;

        if (!this.updatedBalance)
            this.updatedBalance = this.currentBalance;
    }
    next();
});

export default mongoose.model('Transaction', TransactionSchema);