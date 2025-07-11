import { ApiError } from "../error/ApiError"
import User from "../models/User"

export interface IUserProfile {
    username: string
    email: string
    avatar: string
    animals: string[]
    roles: ("user" | "admin")[]
    createdAt: Date
    lastLogin: Date
}

export class ProfileService {
    static async getProfile(userId: string) {
        const user = await User.findById(userId)
        if (!user) throw ApiError.undefined("user undefined")

        const profile: IUserProfile = {
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            animals: user.animals,
            roles: user.roles,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
        }

        return profile
    }
    static async changeAvatar(avatarURL: string, userId: string) {
        const user = await User.findById(userId)
        if (!user) throw ApiError.undefined("user undefined")

        user.avatar = avatarURL
        await user.save()
    }
}
