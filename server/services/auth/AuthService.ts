import { ApiError } from "../../error/ApiError"
import User, { IUserSession } from "../../models/User"
import { HashService } from "./HashService"
import { IJWTPair, JWTService } from "./JWTService"
import { SessionService } from "./SessionService"

export class AuthServiceSelf {
    static async login(username: string, password: string, device: string, ip: string): Promise<IJWTPair> {
        const user = await User.findOne({ username })
        if (!user) throw ApiError.badrequest("user with this username is undefined")

        if (!HashService.check(user.passwordHash, password)) throw ApiError.unauthorized("password is incorrect")

        let session = SessionService.generateNew(device, ip, "self", user.id)

        user.sessions.splice(
            user.sessions.findIndex((v) => v.ip == ip),
            1
        )
        user.sessions.push(session)

        await user.save()

        let pair = JWTService.generatePair(session)

        return pair
    }
    static async register(
        username: string,
        password: string,
        email: string,
        device: string,
        ip: string
    ): Promise<IJWTPair> {
        const username_valid = await User.findOne({ username })
        if (username_valid) throw ApiError.badrequest("user with this username is already created")

        const hash = HashService.hash(password)
        const user = new User({ username, passwordHash: hash, email })

        const session = SessionService.generateNew(device, ip, "self", user.id)

        user.sessions.splice(
            user.sessions.findIndex((v) => v.ip == ip),
            1
        )
        user.sessions.push(session)
        await user.save()

        let pair = JWTService.generatePair(session)
        return pair
    }
    static async logout(session: IUserSession) {
        const user = await User.findById(session.user)
        if (!user) throw ApiError.badrequest("user to logout undefined")
        user.sessions.splice(
            user.sessions.findIndex((v) => v.sessionId == session.sessionId),
            1
        )
        await user.save()
    }
    static async refresh(pair: IJWTPair): Promise<IJWTPair> {
        await JWTService.checkBanByPair(pair)
        const session = await JWTService.validatePair(pair)
        const ban = await JWTService.banPair(pair)
        const newPair = JWTService.generatePair(session)
        return newPair
    }
}
export class AuthServiceGoogle {
    static async login() {}
    static async register() {}
}
