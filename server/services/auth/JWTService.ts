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
    static generatePair(session: IUserSession): IJWTPair {
        const familyId = JWTService.generateFamilyId()

        //@ts-ignore
        const accessToken = sign({ session, familyId }, process.env.JWT_SECRET_ACCESS, {
            expiresIn: process.env.JWT_ACCESS_EXP || "3h",
        })
        //@ts-ignore
        const refreshToken = sign({ session, familyId }, process.env.JWT_SECRET_REFRESH, {
            expiresIn: process.env.JWT_REFRESH_EXP || "3d",
        })

        return { accessToken, refreshToken }
    }
    static async validateAccess(accessToken: string): Promise<IUserSession> {
        const decode = verify(accessToken, process.env.JWT_SECRET_ACCESS) as JwtPayload & IJWTPayload
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
    static async banPair(pair: IJWTPair): Promise<IBannedTokenModel> {
        const decode_ = decode(pair.refreshToken) as JwtPayload & IJWTPayload
        const ban_record = new SelfBannedToken({ familyId: decode_.familyId, sessionId: decode_.session.sessionId })
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
    static async checkBanByPair(pair: IJWTPair) {
        const decode_ = decode(pair.accessToken) as JwtPayload & IJWTPayload
        const ban_record = await SelfBannedToken.findOne({ familyId: decode_.familyId })
        if (!ban_record) return
        if (ban_record.createdAt.getTime() + Number(process.env.SESSION_EXP_TIME) > Date.now())
            throw ApiError.unauthorized("token is banned")
        if (ban_record.createdAt.getTime() + Number(process.env.SESSION_EXP_TIME) < Date.now())
            await ban_record.deleteOne()
    }
}
