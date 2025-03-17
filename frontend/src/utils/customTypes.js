export class CustomError extends Error {
    constructor(message = 'Internal Server Error',status = 500, error = null) {
        super(message);
        this.status = status;
        this.error = error;
    }
}
