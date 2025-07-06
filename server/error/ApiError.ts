export class ApiError extends Error {
    code: number
    constructor(message: string, code: number) {
        super(message)
        this.code = code
    }

    static badrequest(message?: string) {
        return new ApiError(
            "BADREQUEST: " + Boolean(process.env.DEV_MODE)
                ? message || "message is not provided"
                : "message is not provided",
            400
        )
    }
    static forbidden(message?: string) {
        return new ApiError(
            "FORBIDDEN: " + Boolean(process.env.DEV_MODE)
                ? message || "message is not provided"
                : "message is not provided",
            403
        )
    }
    static unauthorized(message?: string) {
        return new ApiError(
            "UNAUTHORIZED: " + Boolean(process.env.DEV_MODE)
                ? message || "message is not provided"
                : "message is not provided",
            401
        )
    }
    static undefined(message?: string) {
        return new ApiError(
            "UNDEFINED: " + Boolean(process.env.DEV_MODE)
                ? message || "message is not provided"
                : "message is not provided",
            404
        )
    }
}
