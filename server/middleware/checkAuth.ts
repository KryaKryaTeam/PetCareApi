import express, { Request as ExpressRequest } from "express"
import { ApiError } from "../error/ApiError"
import { JWTService } from "../services/auth/JWTService"
import User from "../models/User"

export async function checkAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authorization = req.headers.authorization.split(" ")

    if (authorization[0] != "Bearer")
        throw ApiError.badrequest("Authorization token is not Bearer. If you send JWT without Bearer prefix add this")

    let session: any = await JWTService.validateAccess(authorization[1])

    const user = await User.findById(session.user)

    if (!user) throw ApiError.badrequest("User to login undefined")

    if (!user.sessions.find((v) => v.sessionId == session.sessionId)) throw ApiError.unauthorized("session not allowed")

    //@ts-ignore
    req.session = session

    next()
}
