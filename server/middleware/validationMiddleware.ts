import express from "express"
import { ValidationError, validationResult } from "express-validator"
import { ApiError } from "../error/ApiError"

export async function validationMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    const result = validationResult(req)
    console.log(result.array())
    if (!result.isEmpty())
        throw ApiError.badrequest(
            result
                .formatWith((error: { msg: string; path?: string }) => error.msg + " " + error?.path)
                .array()
                .join("\n")
        )
    next()
}
