"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
    static badrequest(message) {
        return new ApiError("BADREQUEST: " + Boolean(process.env.DEV_MODE)
            ? message || "message is not provided"
            : "message is not provided", 400);
    }
    static forbidden(message) {
        return new ApiError("FORBIDDEN: " + Boolean(process.env.DEV_MODE)
            ? message || "message is not provided"
            : "message is not provided", 403);
    }
    static unauthorized(message) {
        return new ApiError("UNAUTHORIZED: " + Boolean(process.env.DEV_MODE)
            ? message || "message is not provided"
            : "message is not provided", 401);
    }
    static undefined(message) {
        return new ApiError("UNDEFINED: " + Boolean(process.env.DEV_MODE)
            ? message || "message is not provided"
            : "message is not provided", 404);
    }
}
exports.ApiError = ApiError;
