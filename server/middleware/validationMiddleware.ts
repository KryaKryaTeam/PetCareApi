import express from "express"
import { validationResult } from "express-validator"
import { ApiError } from "../error/ApiError"

export async function validationMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    const result = validationResult(req)
    if (!result.isEmpty())
        throw ApiError.badrequest(
            result
                .array()
                .map((el) => el.type + "/" + el.msg)
                .join(" - ")
        )
    next()
}
