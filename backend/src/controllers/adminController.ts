import { Request, Response } from 'express';
const Helpers = require('../utils/helpers');

export default {
    signup: async (req : Request, res : Response) : Promise<any> => {
        try {
            // some code
            return res.status(200)
                .json(Helpers.response(true, 'User signed up successfully!!', null, null));
        } catch (error: any) {
            console.log('error in signup ', error);
            return res.status(error.status || 500)
                .json(Helpers.response(false, error?.message || 'Internal server error', null, error.error || null));
        }
    },
}