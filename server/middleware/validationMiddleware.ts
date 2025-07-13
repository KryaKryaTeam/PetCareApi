import express from "express"
import { validationResult } from "express-validator"

export async function validationMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    const result = validationResult(req)
    if (!result.isEmpty()) throw Error("BADREQUEST! " + result.array().map((el) => el.toString()))
    next()
}
