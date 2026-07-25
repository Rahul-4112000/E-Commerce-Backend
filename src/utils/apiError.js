export class ApiError extends Error {
    constructor(statusCode, message) {
        super('something went wrong');
        this.statusCode = statusCode,
            this.message = message
    }
}