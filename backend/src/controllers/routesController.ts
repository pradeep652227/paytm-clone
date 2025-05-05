import jwt, { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Request, Response } from 'express';

import { helpers as Helpers, customTypes as CustomTypes, zodSchemas, zodTypes, customTypes } from '../utils/index';
import config from '../config/config';


interface DecodedToken extends JwtPayload {
    id: string;
    role: string;
}

export const authenticateAPI = async (req: Request, res: Response) : Promise<any>=> {
    try {
        //get the cookie
        const token = req.cookies?.token;
        if (!token)
            throw new customTypes.CustomError('Token not present to process your request', 401);
        let { isValidToken, id, role, user, message } = await validateToken(token);
        if (!isValidToken)
            throw new customTypes.CustomError(message, 403);
        return res.json(Helpers.response(true, '', { isAuthenticated: true, user, role }))
    } catch (error: any) {
        if (!error.status)
            console.error('Error in authenticate API ', error);
        return res.status(error.status || 500)
            .json(Helpers.response(false, error?.message || 'Internal server error', null, error || null));
    }
}

export async function validateToken(token: string) {
    try {
        const roles = config.ROLES;
        let isValidToken = false;
        let decodedInfo: DecodedToken | null = null;
        let matchedRole = '';

        for (const role of roles) {
            try {
                const decoded = jwt.verify(token, (config as Record<any, any>)['SECRET_' + role.toUpperCase()]) as DecodedToken;  // ✅ Type-safe
                isValidToken = true;
                decodedInfo = decoded;
                matchedRole = role;
                break;  // ✅ Stops loop after first valid token
            } catch (err) {
                // Continue loop if verification fails
            }
        }

        if (!isValidToken || !decodedInfo) {
            throw new Error('Invalid token');
        }

        const formattedRole = matchedRole.charAt(0).toUpperCase() + matchedRole.slice(1).toLowerCase();
        if (!mongoose.models[formattedRole]) {
            throw new Error(`Model ${formattedRole} not registered in Mongoose`);
        }
        // ✅ Fetch the user from the database
        const user = await mongoose.model(formattedRole).findById(decodedInfo.id).lean() as any;
        if(!user)
            throw new Error('Invalid user role');
        delete user.password;
        return {
            isValidToken,
            user,
            id: decodedInfo.id,
            role: matchedRole,
            message: ""
        };

    } catch (error: any) {
        return {
            isValidToken: false,
            user: null,
            id: "",
            role: "",
            message: error.message
        };
    }
}
