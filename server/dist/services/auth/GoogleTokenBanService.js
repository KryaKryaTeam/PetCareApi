"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleTokenBanService = void 0;
const ApiError_1 = require("../../error/ApiError");
const BannedToken_1 = require("../../models/BannedToken");
class GoogleTokenBanService {
    static async banToken(token, sessionId) {
        const ban_record = new BannedToken_1.GoogleBannedToken({ token, sessionId });
        await ban_record.save();
    }
    static async checkBan(token) {
        const ban_record = await BannedToken_1.GoogleBannedToken.findOne({ token });
        if (!ban_record)
            return;
        if (ban_record && ban_record.createdAt.getTime() + Number(process.env.SESSION_EXP_TIME) > Date.now())
            throw ApiError_1.ApiError.unauthorized("token is banned");
        if (ban_record.createdAt.getTime() + Number(process.env.SESSION_EXP_TIME) < Date.now())
            await ban_record.deleteOne();
    }
}
exports.GoogleTokenBanService = GoogleTokenBanService;
