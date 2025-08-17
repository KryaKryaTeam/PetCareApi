"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = checkAuth;
const ApiError_1 = require("../error/ApiError");
const JWTService_1 = require("../services/auth/JWTService");
const User_1 = __importDefault(require("../models/User"));
const logger_1 = require("../utils/logger");
async function checkAuth(req, res, next) {
    logger_1.globalLogger.logger().info("User authorization is starts");
    let authorization;
    try {
        authorization = req.headers.authorization.split(" ");
    }
    catch (err) {
        throw ApiError_1.ApiError.unauthorized("Auth token is empty!");
    }
    if (authorization[0] != "Bearer")
        throw ApiError_1.ApiError.badrequest("Authorization token is not Bearer! If you send JWT without Bearer prefix add this.");
    let session = await JWTService_1.JWTService.validateToken(authorization[1]);
    const user = await User_1.default.findById(session.user);
    if (!user)
        throw ApiError_1.ApiError.badrequest("User to login undefined");
    if (!user.sessions.find((v) => v.sessionId == session.sessionId))
        throw ApiError_1.ApiError.unauthorized("session not allowed");
    logger_1.globalLogger.logger().info(`Session ${session.sessionId} is authicated!`);
    req.session = session;
    req.user = user;
    next();
}
