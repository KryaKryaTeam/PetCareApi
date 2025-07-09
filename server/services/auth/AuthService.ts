import { google } from "googleapis"
import { ApiError } from "../../error/ApiError"
import User, { IUserSession } from "../../models/User"
import { HashService } from "./HashService"
import { IJWTPair, JWTService } from "./JWTService"
import { SessionService } from "./SessionService"
import { OAuth2Client } from "google-auth-library"
import { GoogleTokenBanService } from "./GoogleTokenBanService"

interface IGoogleProfile {
    id: string
    email: string
    verified_email: boolean
    name: string
    given_name: string
    family_name: string
    picture: string
}

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
    static async loginUsingGoogle(googleAccessToken: string, device: string, ip: string) {
        await GoogleTokenBanService.checkBan(googleAccessToken)
        const client: OAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

        const tokenInfo = await client.getTokenInfo(googleAccessToken)
        client.credentials.access_token = googleAccessToken

        const profile = await client
            .fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json")
            .then((res) => res.data as IGoogleProfile)

        if (!profile.verified_email) throw ApiError.unauthorized("Need account with verified email")

        const user_ = await User.findOne({ email: profile.email })
        if (!user_) {
            const user = new User({
                username: profile.name,
                avatar: profile.picture,
                email: profile.email,
                isOAuth: true,
                googleId: profile.id,
            })

            let session = SessionService.generateNew(device, ip, "google", user.id)

            await GoogleTokenBanService.banToken(googleAccessToken, session.sessionId)

            user.sessions.splice(
                user.sessions.findIndex((v) => v.ip == ip),
                1
            )
            user.sessions.push(session)

            await user.save()

            let pair = JWTService.generatePair(session)
            return pair
        } else {
            if (!user_.isOAuth)
                throw ApiError.unauthorized("OAuth authorization is not allowed for this account. Use password!")
            if (user_.googleId != profile.id) throw ApiError.unauthorized("token not allowed")

            let session = SessionService.generateNew(device, ip, "google", user_.id)

            await GoogleTokenBanService.banToken(googleAccessToken, session.sessionId)

            user_.sessions.splice(
                user_.sessions.findIndex((v) => v.ip == ip),
                1
            )
            user_.sessions.push(session)

            await user_.save()

            let pair = JWTService.generatePair(session)

            return pair
        }
    }
}
