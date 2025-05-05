import { Request, Response, NextFunction } from "express";
const express = require("express");
import cors from "cors";
import cookieParser from 'cookie-parser';

import { config, services, routes, middlewares } from "./imports";
const app = express();
const PORT = config.PORT || 3000;

app.use(express.json());
app.use(cookieParser()); // Middleware to parse cookies

app.use(middlewares.midd.beforeRouteMidd);

app.use(cors({
    origin : config.ALLOWED_ORIGINS,
    credentials : true
}));
app.use('/api/v1/user', routes.UserRoutes());
app.use('/api/v1/account', routes.AccountRoutes);
app.use('/api/v1/admin', routes.AdminRoutes());
app.use('/api',routes.routes);

app.use(middlewares.midd.errorMidd);

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