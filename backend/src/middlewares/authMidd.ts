import { Request, Response, NextFunction } from 'express';
import { helpers, customTypes } from '../utils/index';
import jwt from 'jsonwebtoken';
import config from '../config/config';

export default async function (req: customTypes.AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
        const authorizationHeader = req.headers['authorization'];

        if (!authorizationHeader) {
            throw new customTypes.CustomError('Unauthorized', 401, 'Authorization header is missing');
        }

        const token = authorizationHeader.split(' ')[1];
        if (!token) {
            throw new customTypes.CustomError('Unauthorized', 401, 'Token is missing');
        }

        const baseUrl = req.baseUrl;

        const decodedInfo : decodedInfoType = await new Promise((resolve, reject) => {
            if (baseUrl.includes('admin')) {
                //Admin token verification
                jwt.verify(token, config.SECRET_ADMIN, (err: any, decodedInfo: any) => {
                    if (err || decodedInfo.role !== 'admin')
                        reject('Unauthorized');
                    resolve(decodedInfo);
                });

            } else if (baseUrl.includes('user') || baseUrl.includes('account')) {
                //User token verification
                jwt.verify(token, config.SECRET, (err: any, decodedInfo: any) => {
                    if (err || decodedInfo.role !== 'user')
                        reject('Unauthorized');
                    resolve(decodedInfo);
                });
            } else {
                reject('Unauthorized!! Invalid base route');
            }
        });

        req['id'] = decodedInfo.id;
        req['role'] = decodedInfo.role;
        return next();

    } catch (error: any) {
        console.error('Error in authMidd: ', error);
        res.status(error.status || 401).json(helpers.response(false, error.message || 'Unauthorized', null, error));
    }
}

interface decodedInfoType {
    id: string;
    role: string;
}