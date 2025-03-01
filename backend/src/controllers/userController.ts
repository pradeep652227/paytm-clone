import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { helpers as Helpers, customTypes as CustomTypes, zodSchemas, zodTypes } from '../utils/index';
import User from '../models/User';
import config from '../config/config';
import { z } from 'zod';
const { userSignupSchema, userSigninSchema } = zodSchemas;

export const signup = async (req: Request, res: Response): Promise<any> => {
    try {
        console.log(`🚀 ~ userController.ts:15 ~ signup ~ parseResult:`);

        const parseResult = userSignupSchema.safeParse(req.body);


        if (!parseResult.success)
            throw new CustomTypes.CustomError('Invalid request body', 400, parseResult.error);

        //create a hash for the user
        const hashedPassword = bcrypt.hashSync(req.body.password, 10);
        //create a new user
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        if (!newUser)
            throw new CustomTypes.CustomError('User creation failed', 500, null);

        res.setHeader('location', `/api/v1/user/${newUser._id}`);
        return res.status(200)
            .json(Helpers.response(true, 'User signed up successfully!!', newUser, null));
    } catch (error: any) {
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

        return res.status(201)
            .json({ ...Helpers.response(true, 'User signed in successfully!!', user, null), token });
    } catch (error: any) {
        console.log('error in signin ', error);
        return res.status(error.status || 500)
            .json(Helpers.response(false, error?.message || 'Internal server error', null, error || null));
    }
}

export const getUser = async (req: CustomTypes.AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        const userId = req.id;
        if (!userId)
            throw new CustomTypes.CustomError('User not found', 404, null);

        const user = await findUserById(userId);
        if (!user)
            throw new CustomTypes.CustomError('User not found', 404, null);

        return res.status(200)
            .json(Helpers.response(true, 'User found successfully', user, null));
    } catch (error: any) {
        console.log('error in getUser ', error);
        return res.status(error.status || 500)
            .json(Helpers.response(false, error?.message || 'Internal server error', null, error || null));
    }
};
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


