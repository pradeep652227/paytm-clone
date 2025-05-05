import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { helpers as Helpers, customTypes as CustomTypes, zodSchemas, zodTypes, customTypes, helpers } from '../utils/index';
import { User, Account, Transaction } from '../models/index';
import { IUser } from '../models/User';
import config from '../config/config';
import { z } from 'zod';
const { userSignupSchema, userSigninSchema } = zodSchemas;

export const signup = async (req: Request, res: Response): Promise<any> => {
    try {
        const parseResult = userSignupSchema.safeParse(req.body);

        if (!parseResult.success)
            throw new CustomTypes.CustomError('Invalid request body', 400, parseResult.error);

        //create a hash for the user
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        //create a new user
        const newUser = await User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName || "",
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });


        if (!newUser)
            throw new CustomTypes.CustomError('User creation failed', 400, null);

        //give a random balance to user from 1 to 10000
        const userBalance = Math.floor(Math.random() * 10000 + 1);

        //create a transaction for the random balance given to the user
        await Transaction.create({
            User: newUser._id,
            amount: userBalance,
            txnType: customTypes.TxnTypes.CREDIT,
            txnMode: customTypes.TxnModes.RANDOM,
            currentBalance: 0,
            updatedBalance: userBalance,
            status: customTypes.RequestStatus.SUCCESS,
            remarks: 'Random Balance on signup!!'
        });

        const userAccount = await Account.create({
            User: newUser._id,
            balance: userBalance
        });
        if (!userAccount)
            throw new CustomTypes.CustomError('User balance addition failed', 400, null);

        res.setHeader('location', `/api/v1/user/${newUser._id}`);
        return res.status(200)
            .json(Helpers.response(true, 'User signed up successfully!!', { user: newUser, balance: userAccount.balance }, null));
    } catch (error: any) {
        if (!error.status)
            console.log('error in signup ', error);
        return res.status(error.status || 500)
            .json(Helpers.response(false, error?.message || 'Internal server error', null, error || null));
    }
}


export const signin = async (req: Request, res: Response): Promise<any> => {
    try {
        const parseResult = userSigninSchema.safeParse(req.body);
        if (!parseResult.success)
            throw new CustomTypes.CustomError('Invalid request body', 400, parseResult.error);

        // find the user
        const user = await findUserByEmail(req.body.email);
        if (!user)
            throw new CustomTypes.CustomError('User not found', 404, null);

        const isPasswordSame = bcrypt.compareSync(req.body.password, user.password);
        if (!isPasswordSame)
            throw new CustomTypes.CustomError('Invalid password', 400, null);

        //sign the jwt token
        const token = jwt.sign({ id: user._id, role: 'user' }, config.SECRET, {
            expiresIn: 86400, // 24 hours
            audience: config.AUDIENCE,
            issuer: config.ISSUER,
            jwtid: 'unique-jwt-id',
            subject: 'user-authentication',
            notBefore: '0', // immediately valid
            keyid: 'just a hint'
        });
        res.set({
            'x-access-token': token,
            'Content-Type': 'application/json'
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: config.NODE_ENV == 'PRODUCTION',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 //1-day
        });

        //before sending the user document, delete the password field
        delete (user as Partial<IUser>).password;

        return res.status(201)
            .json(Helpers.response(true, 'User signed in successfully!!', { user, token }, null));
    } catch (error: any) {
        if (!error.status)
            console.log('error in signin ', error);
        return res.status(error.status || 500)
            .json(Helpers.response(false, error?.message || 'Internal server error', null, error || null));
    }
}

export const signout = async (req: customTypes.AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        console.log('((((())))))) 119 SIGNOUT API');
        //it is an authenticated route, so it is validated that token is present
        const token = req.cookies?.token;
        if (!token)
            throw new CustomTypes.CustomError('Unauthorized!!', 401);
        //invalidate the jwt token and delete the cookie
        console.log('((((())))))) 124 SIGNOUT API');

        // ✅ Clear the cookie from the browser
        res.clearCookie('token', {
            httpOnly: true,
            secure: config.NODE_ENV === 'PRODUCTION',
            sameSite: 'strict'
        });

        //use a blacklist mechanism to invalidate the tokens using Redis or memcached
        console.log('((((())))))) SIGNOUT API END ())))))))))((((((((9');
        return res.json(Helpers.response(true, undefined, {}, undefined));
    } catch (error: any) {
        if (!error.status)
            console.log('error in signout ', error);
        return res.status(error.status || 500)
            .json(Helpers.response(false, error?.message || 'Internal server error', null, error || null));
    }
}
export const getUser = async (req: CustomTypes.AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        console.log('((((((()))) GET USER ()))))))))')
        const userId = req.id;
        if (!userId)
            throw new CustomTypes.CustomError('User not found', 404, null);

        const userAccount = await Account.findOne({ User: userId }).populate('User');
        if (!userAccount)
            throw new CustomTypes.CustomError('User not found or user has no account', 404);
        const user = userAccount.User;
        if (!user)
            throw new CustomTypes.CustomError('User not found', 404, null);

        return res.status(200)
            .json(Helpers.response(true, 'User found successfully', { user, balance: userAccount.balance }, null));
    } catch (error: any) {
        if (!error.status)
            console.log('error in getUser ', error);
        return res.status(error.status || 500)
            .json(Helpers.response(false, error?.message || 'Internal server error', null, error || null));
    }
};

export const getUsers = async (req: CustomTypes.AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        let { isIncludeRequestUser, search } = req.query as any;

        let findFilter: any = {};

        if (isIncludeRequestUser && isIncludeRequestUser == 'false') {
            findFilter['_id'] = { $ne: req.id };
        }
        if(search){
            findFilter['$expr'] = {
                '$regexMatch' : {
                    input : {$concat : ['$firstName', " ",'$lastName']},
                    regex : new RegExp("^" + search, "i")
                }
            }
        }
        
        console.log(`🚀 ~ userController.ts:189 ~ getUsers ~ findFilter:`, findFilter)
        const users = await User.find(findFilter);


        return res.json(Helpers.response(undefined, undefined, { users }, undefined));
    } catch (error: any) {
        if (!error.status)
            console.error('Error in getUsers function :- ', error);
        return res.status(error.status || 500)
            .json(Helpers.response(false, error?.message || 'Internal server error', null, error || null));
    }
}
export const updateUser = async (req: CustomTypes.AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        const userId = req.id;
        if (!userId)
            throw new CustomTypes.CustomError('User not found', 404, null);
        const allowedUpdates = Object.keys(zodSchemas.UserSchema.shape);
        const updates = Object.keys(req.body).reduce((acc, key) => {
            if (allowedUpdates.includes(key))
                acc[key as keyof zodTypes.UserType] = req.body[key];
            return acc;
        }, {} as Partial<zodTypes.UserType>);

        if (Object.keys(updates).length === 0)
            return res.status(200).json(Helpers.response(false, 'No updates found', null, null));
        const userUpdateCount = await User.updateOne({ _id: userId }, updates);

        console.log(`🚀 ~ userController.ts:109 ~ updateUser ~ userUpdateCount:`, userUpdateCount)

        if (userUpdateCount.modifiedCount == 0)
            throw new CustomTypes.CustomError('User update failed', 400, null);

        return res.status(200).json(Helpers.response(true, 'User updated successfully', null, null));
    } catch (error: any) {
        if (!error.status)
            console.error('error in updateUser ', error);
        return res.status(error.status || 500)
            .json(Helpers.response(false, error?.message || 'Internal server error', null, error || null));
    }
}

async function findUserByEmail(email: string) {
    return User.findOne({ email: email });
}

async function findUserById(id: string) {
    return User.findById(id);
};


