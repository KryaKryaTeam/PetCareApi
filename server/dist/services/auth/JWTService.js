"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTService = void 0;
const ApiError_1 = require("../../error/ApiError");
const jsonwebtoken_1 = require("jsonwebtoken");
const SessionService_1 = require("./SessionService");
const BannedToken_1 = require("../../models/BannedToken");
class JWTService {
    static generatePair(session, familyId) {
        //@ts-ignore
        const accessToken = (0, jsonwebtoken_1.sign)({ session, familyId: familyId || JWTService.generateFamilyId() }, process.env.JWT_SECRET_ACCESS, {
            expiresIn: process.env.JWT_ACCESS_EXP || "3h",
        });
        //@ts-ignore
        const refreshToken = (0, jsonwebtoken_1.sign)({ session, familyId: familyId || JWTService.generateFamilyId() }, process.env.JWT_SECRET_REFRESH, {
            expiresIn: process.env.JWT_REFRESH_EXP || "3d",
        });
        return { accessToken, refreshToken };
    }
    static async validateToken(token) {
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET_ACCESS);
        await JWTService.checkBan(decode.familyId);
        return SessionService_1.SessionService.SessionTimestampStringToDate(decode.session);
    }
    static async validateRefreshToken(token) {
        const decode = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET_REFRESH);
        await JWTService.checkBan(decode.familyId);
        return SessionService_1.SessionService.SessionTimestampStringToDate(decode.session);
    }
    static async validatePair(pair) {
        const decode1 = (0, jsonwebtoken_1.verify)(pair.accessToken, process.env.JWT_SECRET_ACCESS);
        const decode2 = (0, jsonwebtoken_1.verify)(pair.refreshToken, process.env.JWT_SECRET_REFRESH);
        if (decode1.familyId != decode2.familyId)
            throw ApiError_1.ApiError.unauthorized("pair is not accepted");
        await JWTService.checkBan(decode1.familyId);
        return SessionService_1.SessionService.SessionTimestampStringToDate(decode1.session);
    }
    static generateFamilyId() {
        const allowed = "qwertyuiopasdfghjklzxcvbnm1234567890".split("");
        let header = "";
        for (let i = 0; i < 32; i++) {
            header += allowed[Math.floor(Math.random() * allowed.length)];
        }
        return Date.now() + "-" + header;
    }
    static async banPairByToken(token) {
        const decode_ = (0, jsonwebtoken_1.decode)(token);
        const ban_record = new BannedToken_1.SelfBannedToken({ familyId: decode_.familyId, sessionId: decode_.session.sessionId });
        await ban_record.save();
        return ban_record;
    }
    static async banPairByFamilyId(familyId, sessionId) {
        const ban_record = new BannedToken_1.SelfBannedToken({ familyId: familyId, sessionId: sessionId });
        await ban_record.save();
        return ban_record;
    }
    static async checkBan(familyId) {
        const ban_record = await BannedToken_1.SelfBannedToken.findOne({ familyId });
        if (!ban_record)
            return;
        if (ban_record && ban_record.createdAt.getTime() + Number(process.env.SESSION_EXP_TIME) > Date.now())
            throw ApiError_1.ApiError.unauthorized("token is banned");
        if (ban_record.createdAt.getTime() + Number(process.env.SESSION_EXP_TIME) < Date.now())
            await ban_record.deleteOne();
    }
    static async checkBanByToken(token) {
        const decode_ = (0, jsonwebtoken_1.decode)(token);
        this.checkBan(decode_.familyId);
    }
}
exports.JWTService = JWTService;
