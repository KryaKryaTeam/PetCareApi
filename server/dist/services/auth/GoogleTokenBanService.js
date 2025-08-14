"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleTokenBanService = void 0;
const ApiError_1 = require("../../error/ApiError");
const BannedToken_1 = require("../../models/BannedToken");
const logger_1 = require("../../utils/logger");
class GoogleTokenBanService {
    static async banToken(token, sessionId) {
        logger_1.globalLogger.logger().setService("google_token_ban_service");
        logger_1.globalLogger.logger().info(`${token} is banned by GoogleTokenBanService`);
        const ban_record = new BannedToken_1.GoogleBannedToken({ token, sessionId });
        await ban_record.save();
    }
    static async checkBan(token) {
        logger_1.globalLogger.logger().setService("google_token_ban_service");
        logger_1.globalLogger.logger().info(`Token check is starts for ${token}`);
        const ban_record = await BannedToken_1.GoogleBannedToken.findOne({ token });
        if (!ban_record)
            return;
        if (ban_record && ban_record.createdAt.getTime() + Number(process.env.SESSION_EXP_TIME) > Date.now())
            throw ApiError_1.ApiError.unauthorized("token is banned");
        if (ban_record.createdAt.getTime() + Number(process.env.SESSION_EXP_TIME) < Date.now()) {
            logger_1.globalLogger.logger().info("Token ban is expired. Service has deleted the record!");
            await ban_record.deleteOne();
        }
    }
}
exports.GoogleTokenBanService = GoogleTokenBanService;
