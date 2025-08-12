"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTService = void 0;
const ApiError_1 = require("../../error/ApiError");
const jsonwebtoken_1 = require("jsonwebtoken");
const SessionService_1 = require("./SessionService");
const BannedToken_1 = require("../../models/BannedToken");
const logger_1 = require("../../utils/logger");
const id_generateor_1 = require("../../utils/id_generateor");
class JWTService {
    static generatePair(session, familyId) {
        logger_1.globalLogger.logger().setService("jwt_service");
        logger_1.globalLogger.logger().info("JWT pair generate is starts");
        //@ts-ignore
        const accessToken = (0, jsonwebtoken_1.sign)({ session, familyId: familyId || JWTService.generateFamilyId() }, process.env.JWT_SECRET_ACCESS, {
            expiresIn: process.env.JWT_ACCESS_EXP || "3h",
        });
        logger_1.globalLogger.logger().info("Access token is signed");
        //@ts-ignore
        const refreshToken = (0, jsonwebtoken_1.sign)({ session, familyId: familyId || JWTService.generateFamilyId() }, process.env.JWT_SECRET_REFRESH, {
            expiresIn: process.env.JWT_REFRESH_EXP || "3d",
        });
        logger_1.globalLogger.logger().info("Refresh token is signed");
        return { accessToken, refreshToken };
    }
    static async validateToken(token) {
        logger_1.globalLogger.logger().setService("jwt_service");
        logger_1.globalLogger.logger().info("JWT token validation is starts");
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET_ACCESS);
        await JWTService.checkBan(decode.familyId);
        logger_1.globalLogger.logger().info("JWT token is succesfuly validated");
        return SessionService_1.SessionService.SessionTimestampStringToDate(decode.session);
    }
    static async validateRefreshToken(token) {
        logger_1.globalLogger.logger().setService("jwt_service");
        logger_1.globalLogger.logger().info("JWT refresh token validation is starts");
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET_REFRESH);
        await JWTService.checkBan(decode.familyId);
        logger_1.globalLogger.logger().info("JWT refresh token is successfully validated");
        return SessionService_1.SessionService.SessionTimestampStringToDate(decode.session);
    }
    static async validatePair(pair) {
        logger_1.globalLogger.logger().setService("jwt_service");
        logger_1.globalLogger.logger().info("JWT pair validation is starts");
        const decode1 = (0, jsonwebtoken_1.verify)(pair.accessToken, process.env.JWT_SECRET_ACCESS);
        logger_1.globalLogger.logger().info("Access token is validated");
        const decode2 = (0, jsonwebtoken_1.verify)(pair.refreshToken, process.env.JWT_SECRET_REFRESH);
        logger_1.globalLogger.logger().info("Refresh token is validated");
        if (decode1.familyId != decode2.familyId)
            throw ApiError_1.ApiError.unauthorized("pair is not accepted");
        await JWTService.checkBan(decode1.familyId);
        logger_1.globalLogger.logger().info("JWT pair is successfully validated!");
        return SessionService_1.SessionService.SessionTimestampStringToDate(decode1.session);
    }
    static generateFamilyId() {
        return (0, id_generateor_1.generateId)("jwt");
    }
    static async banPairByToken(token) {
        logger_1.globalLogger.logger().setService("jwt_service");
        logger_1.globalLogger.logger().info("Ban pair is starts");
        const decode_ = (0, jsonwebtoken_1.decode)(token);
        const ban_record = new BannedToken_1.SelfBannedToken({
            familyId: decode_.familyId,
            sessionId: decode_.session.sessionId,
        });
        await ban_record.save();
        return ban_record;
    }
    static async banPairByFamilyId(familyId, sessionId) {
        logger_1.globalLogger.logger().setService("jwt_service");
        logger_1.globalLogger.logger().info("Ban pair is starts");
        const ban_record = new BannedToken_1.SelfBannedToken({
            familyId: familyId,
            sessionId: sessionId,
        });
        await ban_record.save();
        return ban_record;
    }
    static async checkBan(familyId) {
        logger_1.globalLogger.logger().setService("jwt_service");
        logger_1.globalLogger.logger().info("Check ban of token is starts");
        const ban_record = await BannedToken_1.SelfBannedToken.findOne({ familyId });
        if (!ban_record)
            return;
        if (ban_record && ban_record.createdAt.getTime() + Number(process.env.SESSION_EXP_TIME) > Date.now())
            throw ApiError_1.ApiError.unauthorized("token is banned");
        if (ban_record.createdAt.getTime() + Number(process.env.SESSION_EXP_TIME) < Date.now()) {
            await ban_record.deleteOne();
            logger_1.globalLogger.logger().info("Ban record is deleted");
        }
        logger_1.globalLogger.logger().info("Check ban is successfully");
    }
    static async checkBanByToken(token) {
        const decode_ = (0, jsonwebtoken_1.decode)(token);
        this.checkBan(decode_.familyId);
    }
}
exports.JWTService = JWTService;
