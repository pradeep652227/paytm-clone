import {Request,Response,NextFunction} from 'express'

export function beforeRouteMidd(req: Request, res: Response, next: NextFunction) {
    console.log('****************************************************************************');
    console.info(`Request came for this request (type = ${req.method}) :- ${req.protocol}://${req.get('host')}${req.originalUrl} at ${Date.now()}`);
    next();
}

export function errorMidd(err: any, req: Request, res: Response, next: NextFunction) {
    console.log('////////////////////////////////////////////////////////////////////////////');
    console.info(`Error came for this request (type = ${req.method}) :- ${req.protocol}://${req.get('host')}${req.originalUrl} at ${Date.now()} :- `);
    console.error(err);
    return res.status(err.status || 500).json({ status: false, message: err.message || 'Internal server error', error: err.error || null });
}