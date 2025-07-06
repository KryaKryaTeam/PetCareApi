import { ApiError } from "../../error/ApiError"
import { IUserSession } from "../../models/User"
import { JwtPayload, sign, verify } from "jsonwebtoken"
import { SessionService } from "./SessionService"

export interface IJWTPair {
    accessToken: string
    refreshToken: string
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
    static validateAccess(accessToken: string) {
        const decode: any = verify(accessToken, process.env.JWT_SECRET_ACCESS)
        return SessionService.SessionTimestampStringToDate(decode.session)
    }
    static validatePair(pair: IJWTPair) {
        const decode1: any = verify(pair.accessToken, process.env.JWT_SECRET_ACCESS)
        const decode2: any = verify(pair.refreshToken, process.env.JWT_SECRET_REFRESH)

        if (decode1.familyId != decode2.familyId) throw ApiError.unauthorized("pair is not accepted")

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
}
