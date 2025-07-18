import { ApiError } from "../error/ApiError"
import User from "../models/User"

export async function middleware(req, res, next) {
    //@ts-ignore
    const session = req.session

    const user = await User.findById(session.user)
    if (!user) throw ApiError.forbidden("no access")
    if (!user.roles.includes("admin")) throw ApiError.forbidden("no access")
    next()
}
