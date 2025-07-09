import { ApiError } from "../../error/ApiError"
import { GoogleBannedToken } from "../../models/BannedToken"

export class GoogleTokenBanService {
    static async banToken(token: string, sessionId: string) {
        const ban_record = new GoogleBannedToken({ token, sessionId })
        await ban_record.save()
    }
    static async checkBan(token: string) {
        const ban_record = await GoogleBannedToken.findOne({ token })
        if (!ban_record) return
        if (ban_record && ban_record.createdAt.getTime() + Number(process.env.SESSION_EXP_TIME) > Date.now())
            throw ApiError.unauthorized("token is banned")
        if (ban_record.createdAt.getTime() + Number(process.env.SESSION_EXP_TIME) < Date.now())
            await ban_record.deleteOne()
    }
}
