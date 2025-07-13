"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = middleware;
const ApiError_1 = require("../error/ApiError");
const User_1 = __importDefault(require("../models/User"));
async function middleware(req, res, next) {
    //@ts-ignore
    const session = req.session;
    const user = await User_1.default.findById(session.user);
    if (!user)
        throw ApiError_1.ApiError.forbidden("no access");
    if (!user.roles.includes("admin"))
        throw ApiError_1.ApiError.forbidden("no access");
    next();
}
