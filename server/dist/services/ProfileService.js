"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const ApiError_1 = require("../error/ApiError");
const User_1 = __importDefault(require("../models/User"));
class ProfileService {
    static async getProfile(userId) {
        const user = await User_1.default.findById(userId);
        if (!user)
            throw ApiError_1.ApiError.undefined("user undefined");
        const profile = {
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            animals: user.animals,
            roles: user.roles,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
        };
        return profile;
    }
    static async changeAvatar(avatarURL, userId) {
        const user = await User_1.default.findById(userId);
        if (!user)
            throw ApiError_1.ApiError.undefined("user undefined");
        user.avatar = avatarURL;
        await user.save();
    }
}
exports.ProfileService = ProfileService;
