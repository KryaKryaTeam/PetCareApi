"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = checkAuth;
const ApiError_1 = require("../error/ApiError");
const JWTService_1 = require("../services/auth/JWTService");
const User_1 = __importDefault(require("../models/User"));
async function checkAuth(req, res, next) {
    const authorization = req.headers.authorization.split(" ");
    if (authorization[0] != "Bearer")
        throw ApiError_1.ApiError.badrequest("Authorization token is not Bearer. If you send JWT without Bearer prefix add this");
    let session = await JWTService_1.JWTService.validateToken(authorization[1]);
    const user = await User_1.default.findById(session.user);
    if (!user)
        throw ApiError_1.ApiError.badrequest("User to login undefined");
    if (!user.sessions.find((v) => v.sessionId == session.sessionId))
        throw ApiError_1.ApiError.unauthorized("session not allowed");
    //@ts-ignore
    req.session = session;
    next();
}
