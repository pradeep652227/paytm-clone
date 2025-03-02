import { Response } from 'express';
import mongoose from 'mongoose';

import { Account, Transaction } from '../models/index';
import { customTypes as CustomTypes, helpers as Helpers } from '../utils/index';

export const GetBalance = async (req: CustomTypes.AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        const userId = req.id;
        const account = await Account.findOne({ User: userId });
        if (!account)
            throw new CustomTypes.CustomError('Account not found', 404, null);

        return res.status(200)
            .json(Helpers.response(true, 'Account balance fetched successfully!!', { balance: account.balance }, null));
    } catch (error: any) {
        console.log('error in getBalance ', error);
        return res.status(error.status || 500)
            .json(Helpers.response(false, error?.message || 'Internal server error', null, error || null));
    }
}

export const Transfer = async (req: CustomTypes.AuthenticatedRequest, res: Response): Promise<any> => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const userId = req.id;
        const { toUserId } = req.body;
        const amount = Number(req.body.amount);

        if (!toUserId || !amount || amount <= 0)
            throw new CustomTypes.CustomError('Required fields are missing!!', 401, null);

        const fromAccount = await Account.findOne({ User: userId }).session(session);
        if (!fromAccount)
            throw new CustomTypes.CustomError('Account not found', 404, null);

        // Check if the user has required balance
        if (fromAccount.balance < amount)
            throw new CustomTypes.CustomError('Insufficient balance!!', 400, null);

        const toAccount = await Account.findOne({ User: toUserId }).session(session);
        if (!toAccount)
            throw new CustomTypes.CustomError('Receiver account not found', 404, null);

        // **Manually create transaction documents, then save them**
        const fromAccountTransaction = new Transaction({
            User: fromAccount.User,
            amount: amount,
            currentBalance: fromAccount.balance,
            txnType: CustomTypes.TxnTypes.DEBIT
        });
        fromAccountTransaction.$session(session);

        const toAccountTransaction = new Transaction({
            User: toAccount.User,
            amount: amount,
            currentBalance: toAccount.balance,
            txnType: CustomTypes.TxnTypes.CREDIT
        });
        toAccountTransaction.$session(session);// ✅ Bind session

        // Save transactions inside the session
        await fromAccountTransaction.save({ session });
        await toAccountTransaction.save({ session });

        // **Update account balances**
        fromAccount.balance -= amount;
        await fromAccount.save({ session });

        toAccount.balance += amount;
        await toAccount.save({ session });

        // **Update transaction status and final balance**
        fromAccountTransaction.status = CustomTypes.RequestStatus.SUCCESS;
        fromAccountTransaction.updatedBalance = fromAccount.balance;
        await fromAccountTransaction.save({ session });

        toAccountTransaction.status = CustomTypes.RequestStatus.SUCCESS;
        toAccountTransaction.updatedBalance = toAccount.balance;
        await toAccountTransaction.save({ session });

        console.log('fromAccountTransaction ', fromAccountTransaction);
        
        // Commit transaction
        await session.commitTransaction();
        return res.status(200)
            .json(Helpers.response(true, 'Amount transferred successfully!!', { balance: fromAccount.balance }, null));
    } catch (error: any) {
        await session.abortTransaction();
        console.log('Error in transfer:', error);
        return res.status(error.status || 500)
            .json(Helpers.response(false, error?.message || 'Internal server error', null, error || null));
    } finally {
        session.endSession();
    }
};



// export const Transfer = async (req: any): Promise<any> => {
//     const MAX_RETRIES = 3;
//     let attempt = 1;

//     while (attempt <= MAX_RETRIES) {
//         const session = await mongoose.startSession(); // Create a new session for each retry

//         try {
//             session.startTransaction();
//             const userId = req.id;
//             const { toUserId } = req.body;
//             const amount = Number(req.body.amount);

//             if (!toUserId || !amount || amount <= 0)
//                 throw new CustomTypes.CustomError('Required fields are missing!!', 401, null);

//             const fromAccount = await Account.findOne({ User: userId }).session(session);
//             if (!fromAccount)
//                 throw new CustomTypes.CustomError('Account not found', 404, null);

//             if (fromAccount.balance < amount)
//                 throw new CustomTypes.CustomError('Insufficient balance!!', 400, null);

//             const toAccount = await Account.findOne({ User: toUserId }).session(session);
//             if (!toAccount)
//                 throw new CustomTypes.CustomError('Receiver account not found', 404, null);

//             console.info('fromUserBalance before transaction ', fromAccount.balance);

//             // Transfer amount logic
//             fromAccount.balance -= amount;
//             await fromAccount.save({ session });

//             toAccount.balance += amount;
//             await toAccount.save({ session });

//             await session.commitTransaction();
//             session.endSession(); // End session only on success

//             console.info('Transaction Successful!!');
//             console.info('fromUserBalance now :- ', fromAccount.balance);
//             return { success: true, message: 'Amount transferred successfully', balance: fromAccount.balance };

//         } catch (error: any) {
//             await session.abortTransaction();
//             session.endSession(); // End session on failure

//             console.log('error in transfer ', error);
//             console.info('error in Transaction function ');

//             if (attempt < MAX_RETRIES) {
//                 console.info(`Retrying transaction, attempt ${attempt}`);
//                 attempt++;
//             } else {
//                 console.error('Transaction failed after maximum retries!!!!');
//                 return { success: false, message: 'Transaction failed after retries', error };
//             }

//         }
//     }
// };

// Transfer({
//     id: "67c35444c5c4e9ac82635f36",
//     body: {
//         toUserId: "67c35c531adeeb81b880854b",
//         amount: 100
//     }
// })

// Transfer({
//     id: "67c35444c5c4e9ac82635f36",
//     body: {
//         toUserId: "67c35c531adeeb81b880854b",
//         amount: 100
//     }
// })
