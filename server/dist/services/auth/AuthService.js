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
class AuthServiceSelf {
    static async login(username, password, device, ip) {
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
        let pair = JWTService_1.JWTService.generatePair(session, familyId);
        return pair;
    }
    static async register(username, password, email, device, ip) {
        const username_valid = await User_1.default.findOne({ username });
        if (username_valid)
            throw ApiError_1.ApiError.badrequest("user with this username is already created");
        const hash = HashService_1.HashService.hash(password);
        const user = new User_1.default({ username, passwordHash: hash, email });
        const familyId = JWTService_1.JWTService.generateFamilyId();
        const session = SessionService_1.SessionService.generateNew(device, ip, "self", user.id, familyId);
        user.sessions.splice(user.sessions.findIndex((v) => v.ip == ip), 1);
        user.sessions.push(session);
        await user.save();
        let pair = JWTService_1.JWTService.generatePair(session, familyId);
        return pair;
    }
    static async logout(session) {
        const user = await User_1.default.findById(session.user);
        if (!user)
            throw ApiError_1.ApiError.badrequest("user to logout undefined");
        user.sessions.splice(user.sessions.findIndex((v) => v.sessionId == session.sessionId), 1);
        await user.save();
    }
    static async closeSession(sessionId, userId) {
        const user = await User_1.default.findById(userId);
        if (!user)
            throw ApiError_1.ApiError.badrequest("undefined user");
        const session = user.sessions.find((a) => a.sessionId == sessionId);
        if (!session)
            throw ApiError_1.ApiError.badrequest("session to close undefined");
        const record = await JWTService_1.JWTService.banPairByFamilyId(session.familyId, session.sessionId);
        user.sessions.splice(user.sessions.findIndex((a) => a.sessionId == session.sessionId), 1);
    }
    static async refresh(refreshToken) {
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
        const ban = await JWTService_1.JWTService.banPairByToken(refreshToken);
        const newPair = JWTService_1.JWTService.generatePair(session, familyId);
        return newPair;
    }
    static async getAllSessions(userId) {
        const user = await User_1.default.findById(userId);
        if (!user)
            throw ApiError_1.ApiError.badrequest("user undefined");
        return user.sessions;
    }
    static async loginUsingGoogle(googleAccessToken, device, ip) {
        await GoogleTokenBanService_1.GoogleTokenBanService.checkBan(googleAccessToken);
        const client = new google_auth_library_1.OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        const tokenInfo = await client.getTokenInfo(googleAccessToken);
        client.credentials.access_token = googleAccessToken;
        const profile = await client
            .fetch("https://www.googleapis.com/oauth2/v1/userinfo?alt=json")
            .then((res) => res.data);
        if (!profile.verified_email)
            throw ApiError_1.ApiError.unauthorized("Need account with verified email");
        const user_ = await User_1.default.findOne({ email: profile.email });
        if (!user_) {
            const user = new User_1.default({
                username: profile.name,
                avatar: profile.picture,
                email: profile.email,
                isOAuth: true,
                googleId: profile.id,
            });
            const familyId = JWTService_1.JWTService.generateFamilyId();
            let session = SessionService_1.SessionService.generateNew(device, ip, "google", user.id, familyId);
            await GoogleTokenBanService_1.GoogleTokenBanService.banToken(googleAccessToken, session.sessionId);
            user.sessions.splice(user.sessions.findIndex((v) => v.ip == ip), 1);
            user.sessions.push(session);
            user.lastLogin = new Date();
            await user.save();
            let pair = JWTService_1.JWTService.generatePair(session, familyId);
            return pair;
        }
        else {
            if (!user_.isOAuth)
                throw ApiError_1.ApiError.unauthorized("OAuth authorization is not allowed for this account. Use password!");
            if (user_.googleId != profile.id)
                throw ApiError_1.ApiError.unauthorized("token not allowed");
            const familyId = JWTService_1.JWTService.generateFamilyId();
            let session = SessionService_1.SessionService.generateNew(device, ip, "google", user_.id, familyId);
            await GoogleTokenBanService_1.GoogleTokenBanService.banToken(googleAccessToken, session.sessionId);
            user_.sessions.splice(user_.sessions.findIndex((v) => v.ip == ip), 1);
            user_.sessions.push(session);
            user_.lastLogin = new Date();
            await user_.save();
            let pair = JWTService_1.JWTService.generatePair(session, familyId);
            return pair;
        }
    }
}
exports.AuthServiceSelf = AuthServiceSelf;
