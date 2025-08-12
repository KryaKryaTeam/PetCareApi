import { isDevMode } from "../utils/isDevMode"

export class ApiError extends Error {
    code: number
    constructor(message: string, code: number) {
        super(message)
        this.code = code
    }

    static badrequest(message?: string) {
        return new ApiError(
            "BADREQUEST: " + isDevMode() ? message || "message is not provided" : "message is not provided",
            400
        )
    }
    static forbidden(message?: string) {
        return new ApiError(
            "FORBIDDEN: " + isDevMode() ? message || "message is not provided" : "message is not provided",
            403
        )
    }
    static unauthorized(message?: string) {
        return new ApiError(
            "UNAUTHORIZED: " + isDevMode() ? message || "message is not provided" : "message is not provided",
            401
        )
    }
    static undefined(message?: string) {
        return new ApiError(
            "UNDEFINED: " + isDevMode() ? message || "message is not provided" : "message is not provided",
            404
        )
    }
}
