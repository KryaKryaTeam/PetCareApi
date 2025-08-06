"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServiceSelf = void 0;
const ApiError_1 = require("../../error/ApiError");
const User_1 = __importDefault(require("../../models/User"));
const HashService_1 = require("./HashService");
const JWTService_1 = require("./JWTService");
const SessionService_1 = require("./SessionService");
const google_auth_library_1 = require("google-auth-library");
const GoogleTokenBanService_1 = require("./GoogleTokenBanService");
const logger_1 = require("../../utils/logger");
class AuthServiceSelf {
    static async login(username, password, device, ip) {
        logger_1.globalLogger.logger().info(`Login started for ${username}`);
        const user = await User_1.default.findOne({ username });
        if (!user)
            throw ApiError_1.ApiError.badrequest("user with this username is undefined");
        if (!HashService_1.HashService.check(user.passwordHash, password))
            throw ApiError_1.ApiError.unauthorized("password is incorrect");
        let familyId = JWTService_1.JWTService.generateFamilyId();
        let session = SessionService_1.SessionService.generateNew(device, ip, "self", user.id, familyId);
        user.sessions.splice(user.sessions.findIndex((v) => v.ip == ip), 1);
        user.sessions.push(session);
        user.lastLogin = new Date();
        await user.save();
        logger_1.globalLogger.logger().info(`Login completed for ${username}`);
        let pair = JWTService_1.JWTService.generatePair(session, familyId);
        return pair;
    }
    static async register(username, password, email, device, ip) {
        logger_1.globalLogger.logger().info(`Registration started for ${username}`);
        const username_valid = await User_1.default.findOne({ username });
        const email_valid = await User_1.default.findOne({ email });
        if (username_valid || email_valid)
            throw ApiError_1.ApiError.badrequest("user with this username or email is already created");
        const hash = HashService_1.HashService.hash(password);
        const user = new User_1.default({ username, passwordHash: hash, email });
        const familyId = JWTService_1.JWTService.generateFamilyId();
        const session = SessionService_1.SessionService.generateNew(device, ip, "self", user.id, familyId);
        user.sessions.splice(user.sessions.findIndex((v) => v.ip == ip), 1);
        user.sessions.push(session);
        await user.save();
        logger_1.globalLogger.logger().info(`Registration completed for ${username}`);
        let pair = JWTService_1.JWTService.generatePair(session, familyId);
        return pair;
    }
    static async logout(session) {
        logger_1.globalLogger.logger().info(`Logout started for user ${session.user}`);
        const user = await User_1.default.findById(session.user);
        if (!user)
            throw ApiError_1.ApiError.badrequest("user to logout undefined");
        user.sessions.splice(user.sessions.findIndex((v) => v.sessionId == session.sessionId), 1);
        await user.save();
        logger_1.globalLogger.logger().info(`Logout completed for user ${session.user}`);
    }
    static async closeSession(sessionId, userId) {
        logger_1.globalLogger.logger().info(`Close session started for user ${userId}`);
        const user = await User_1.default.findById(userId);
        if (!user)
            throw ApiError_1.ApiError.badrequest("undefined user");
        const session = user.sessions.find((a) => a.sessionId == sessionId);
        if (!session)
            throw ApiError_1.ApiError.badrequest("session to close undefined");
        const record = await JWTService_1.JWTService.banPairByFamilyId(session.familyId, session.sessionId);
        user.sessions.splice(user.sessions.findIndex((a) => a.sessionId == session.sessionId), 1);
        logger_1.globalLogger.logger().info(`Close session completed for user ${userId}`);
    }
    static async refresh(refreshToken) {
        logger_1.globalLogger.logger().info(`Refresh started`);
        await JWTService_1.JWTService.checkBanByToken(refreshToken);
        const session = await JWTService_1.JWTService.validateRefreshToken(refreshToken);
        const user = await User_1.default.findById(session.user);
        if (!user)
            throw ApiError_1.ApiError.unauthorized("token is invalid");
        user.sessions.splice(user.sessions.findIndex((a) => a.sessionId == session.sessionId), 1);
        const familyId = JWTService_1.JWTService.generateFamilyId();
        session.familyId = familyId;
        session.expiresAt = new Date(Date.now() + Number(process.env.SESSION_EXP_TIME));
        user.sessions.push(session);
        await user.save();
        logger_1.globalLogger.logger().info(`Refresh completed for user ${session.user}`);
        const ban = await JWTService_1.JWTService.banPairByToken(refreshToken);
        const newPair = JWTService_1.JWTService.generatePair(session, familyId);
        return newPair;
    }
    static async getAllSessions(userId) {
        logger_1.globalLogger.logger().info(`Get all sessions started for user ${userId}`);
        const user = await User_1.default.findById(userId);
        if (!user)
            throw ApiError_1.ApiError.badrequest("user undefined");
        logger_1.globalLogger.logger().info(`Get all sessions completed for user ${userId}`);
        return user.sessions;
    }
    static async loginUsingGoogle(googleAccessToken, device, ip) {
        logger_1.globalLogger.logger().info(`Google login started`);
        await GoogleTokenBanService_1.GoogleTokenBanService.checkBan(googleAccessToken);
        const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const ticket = await client.verifyIdToken({
            idToken: googleAccessToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        client.credentials.access_token = googleAccessToken;
        const profile = ticket.getPayload();
        if (!profile.email_verified)
            throw ApiError_1.ApiError.unauthorized("Need account with verified email");
        const user_ = await User_1.default.findOne({ email: profile.email });
        if (!user_) {
            const user = new User_1.default({
                username: profile.name,
                avatar: profile.picture,
                email: profile.email,
                isOAuth: true,
                googleId: profile.sub,
            });
            const familyId = JWTService_1.JWTService.generateFamilyId();
            let session = SessionService_1.SessionService.generateNew(device, ip, "google", user.id, familyId);
            await GoogleTokenBanService_1.GoogleTokenBanService.banToken(googleAccessToken, session.sessionId);
            user.sessions.splice(user.sessions.findIndex((v) => v.ip == ip), 1);
            user.sessions.push(session);
            user.lastLogin = new Date();
            await user.save();
            logger_1.globalLogger
                .logger()
                .info(`Google login completed for new user ${profile.email}`);
            let pair = JWTService_1.JWTService.generatePair(session, familyId);
            return pair;
        }
        else {
            if (!user_.isOAuth)
                throw ApiError_1.ApiError.unauthorized("OAuth authorization is not allowed for this account. Use password!");
            if (user_.googleId != profile.sub)
                throw ApiError_1.ApiError.unauthorized("token not allowed");
            const familyId = JWTService_1.JWTService.generateFamilyId();
            let session = SessionService_1.SessionService.generateNew(device, ip, "google", user_.id, familyId);
            await GoogleTokenBanService_1.GoogleTokenBanService.banToken(googleAccessToken, session.sessionId);
            user_.sessions.splice(user_.sessions.findIndex((v) => v.ip == ip), 1);
            user_.sessions.push(session);
            user_.lastLogin = new Date();
            await user_.save();
            logger_1.globalLogger
                .logger()
                .info(`Google login completed for existing user ${profile.email}`);
            let pair = JWTService_1.JWTService.generatePair(session, familyId);
            return pair;
        }
    }
}
exports.AuthServiceSelf = AuthServiceSelf;
