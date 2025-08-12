"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
const isDevMode_1 = require("../utils/isDevMode");
class ApiError extends Error {
    constructor(message, code) {
        super(message);
        this.code = code;
    }
    static badrequest(message) {
        return new ApiError("BADREQUEST: " + (0, isDevMode_1.isDevMode)() ? message || "message is not provided" : "message is not provided", 400);
    }
    static forbidden(message) {
        return new ApiError("FORBIDDEN: " + (0, isDevMode_1.isDevMode)() ? message || "message is not provided" : "message is not provided", 403);
    }
    static unauthorized(message) {
        return new ApiError("UNAUTHORIZED: " + (0, isDevMode_1.isDevMode)() ? message || "message is not provided" : "message is not provided", 401);
    }
    static undefined(message) {
        return new ApiError("UNDEFINED: " + (0, isDevMode_1.isDevMode)() ? message || "message is not provided" : "message is not provided", 404);
    }
}
exports.ApiError = ApiError;
