import { Request } from 'express';

export class CustomError extends Error {
    status: number;
    error: Error | any;
    constructor(message: string = 'Internal Server Error',
        status: number = 500, error: Error | any = null) {
        super(message);
        this.status = status;
        this.error = error;
    }
}

export interface AuthenticatedRequest extends Request {
    id?: string;
    role?: string;
}

export enum TxnTypes {
    CREDIT = 'C',
    DEBIT = 'D'
}

export enum RequestStatus {
    PENDING = 'P',
    SUCCESS = 'S',
    FAILURE = 'F'
}

export enum TxnModes {
    RANDOM = 'RANDOM BALANCE',
    TRANSFER = 'TRANSFER'
}