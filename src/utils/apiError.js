export class ApiError extends Error {
    constructor(statusCode, message = 'something went wrong') {
        super(message);
        this.statusCode = statusCode;
    }
}

export const handleMongoError = (err) => {
    if (err.name === "ValidationError") {
        return new ApiError(400, err.message);
    }

    if (err.name === "CastError") {
        return new ApiError(400, "Invalid ID");
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];

        return new ApiError(409, `${field} already exists`);
    }

    return err;
};

export const handleNodeMailerErrors = (error) => {
    switch (error.code) {
        case "EAUTH":
            console.error("SMTP Authentication failed:", error);
            break;

        case "ECONNECTION":
            console.error("Could not connect to SMTP server:", error);
            break;

        case "ETIMEDOUT":
            console.error("SMTP connection timed out:", error);
            break;

        case "EENVELOPE":
            console.error("Invalid sender or recipient:", error);
            break;

        default:
            console.error(error);
    }

    return new ApiError(
        500,
        "Unable to send email. Please try again later.",
    );
}