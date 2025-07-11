import { ApiError } from "../../error/ApiError"
import { IUserSession } from "../../models/User"
import { decode, JwtPayload, sign, verify } from "jsonwebtoken"
import { SessionService } from "./SessionService"
import { SelfBannedToken, IBannedTokenModel } from "../../models/BannedToken"

export interface IJWTPair {
    accessToken: string
    refreshToken: string
}

export interface IJWTPayload {
    familyId: string
    session: IUserSession
}

export class JWTService {
    static generatePair(session: IUserSession, familyId?: string): IJWTPair {
        //@ts-ignore
        const accessToken = sign(
            { session, familyId: familyId || JWTService.generateFamilyId() },
            process.env.JWT_SECRET_ACCESS,
            {
                expiresIn: process.env.JWT_ACCESS_EXP || "3h",
            }
        )
        //@ts-ignore
        const refreshToken = sign(
            { session, familyId: familyId || JWTService.generateFamilyId() },
            process.env.JWT_SECRET_REFRESH,
            {
                expiresIn: process.env.JWT_REFRESH_EXP || "3d",
            }
        )

        return { accessToken, refreshToken }
    }
    static async validateToken(token: string): Promise<IUserSession> {
        const decode = verify(token, process.env.JWT_SECRET_ACCESS) as JwtPayload & IJWTPayload
        await JWTService.checkBan(decode.familyId)
        return SessionService.SessionTimestampStringToDate(decode.session)
    }
    static async validateRefreshToken(token: string): Promise<IUserSession> {
        const decode = verify(token, process.env.JWT_SECRET_REFRESH) as JwtPayload & IJWTPayload
        await JWTService.checkBan(decode.familyId)
        return SessionService.SessionTimestampStringToDate(decode.session)
    }
    static async validatePair(pair: IJWTPair): Promise<IUserSession> {
        const decode1: any = verify(pair.accessToken, process.env.JWT_SECRET_ACCESS)
        const decode2: any = verify(pair.refreshToken, process.env.JWT_SECRET_REFRESH)

        if (decode1.familyId != decode2.familyId) throw ApiError.unauthorized("pair is not accepted")
        await JWTService.checkBan(decode1.familyId)

        return SessionService.SessionTimestampStringToDate(decode1.session)
    }
    static generateFamilyId(): string {
        const allowed = "qwertyuiopasdfghjklzxcvbnm1234567890".split("")
        let header = ""
        for (let i = 0; i < 32; i++) {
            header += allowed[Math.floor(Math.random() * allowed.length)]
        }
        return Date.now() + "-" + header
    }
    static async banPairByToken(token: string): Promise<IBannedTokenModel> {
        const decode_ = decode(token) as JwtPayload & IJWTPayload
        const ban_record = new SelfBannedToken({ familyId: decode_.familyId, sessionId: decode_.session.sessionId })
        await ban_record.save()
        return ban_record
    }
    static async banPairByFamilyId(familyId: string, sessionId: string) {
        const ban_record = new SelfBannedToken({ familyId: familyId, sessionId: sessionId })
        await ban_record.save()
        return ban_record
    }
    static async checkBan(familyId) {
        const ban_record = await SelfBannedToken.findOne({ familyId })
        if (!ban_record) return
        if (ban_record && ban_record.createdAt.getTime() + Number(process.env.SESSION_EXP_TIME) > Date.now())
            throw ApiError.unauthorized("token is banned")
        if (ban_record.createdAt.getTime() + Number(process.env.SESSION_EXP_TIME) < Date.now())
            await ban_record.deleteOne()
    }
    static async checkBanByToken(token: string) {
        const decode_ = decode(token) as JwtPayload & IJWTPayload
        this.checkBan(decode_.familyId)
    }
}
