import { Request, Response, NextFunction } from "express";
const express = require("express");
const { config, services, routes } = require("./imports");
const app = express();
const PORT = config.PORT || 3000;

app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log('****************************************************************************');
    console.info(`Request came for this request (type = ${req.method}) :- ${req.protocol}://${req.get('host')}${req.originalUrl} at ${Date.now().toLocaleString()}`);
    next();
});

app.use('/api/v1/user', routes.UserRoutes());
app.use('/api/v1/admin', routes.AdminRoutes());

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log('////////////////////////////////////////////////////////////////////////////');
    console.info(`Error came for this request (type = ${req.method}) :- ${req.protocol}://${req.get('host')}${req.originalUrl} at ${Date.now()} :- `);
    console.error(err);
    return res.status(err.status || 500).json({ status: false, message: err.message || 'Internal server error', error: err.error || null });
});

process.on('uncaughtException', (err: any) => {
    console.log('////////////////////////////////////////////////////////////////////////////');
    console.error(`Uncaught exception came :- `, err);
    process.exit(1);
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
    console.log('////////////////////////////////////////////////////////////////////////////');
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

app.listen(PORT, async () => {
    try {
        await services.db.connect();
        console.info(`Server has started on ${PORT}`);
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        process.exit(1);
    }
});