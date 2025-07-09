import mongoose, { ObjectId } from "mongoose"

export interface IUserSession {
    provider: "self" | "google"
    sessionId: string
    user: mongoose.Types.ObjectId
    device?: string
    ip?: string
    createdAt: Date
    expiresAt?: Date | null
}

export interface IUser {
    username: string
    email: string
    isOAuth: boolean
    passwordHash?: string
    googleId?: string
    animals?: string[]
    avatar?: string
    sessions?: IUserSession[]
    roles?: ("user" | "admin" | "staff")[]
    status?: "active" | "blocked" | "archived"
    createdAt?: Date
    lastLogin?: Date
}

export interface IUserModel extends Document {
    username: string
    email: string
    isOAuth: boolean
    passwordHash?: string
    googleId?: string
    animals?: string[]
    avatar?: string
    sessions?: IUserSession[]
    roles?: ("user" | "admin" | "staff")[]
    status?: "active" | "blocked" | "archived"
    createdAt?: Date
    lastLogin?: Date
}

const SessionSchema = new mongoose.Schema<IUserSession>(
    {
        provider: { type: String, required: true, enum: ["google", "self"] },
        sessionId: { type: String, required: true },
        device: { type: String },
        ip: { type: String },
        createdAt: { type: Date, default: new Date() },
        expiresAt: { type: Date },
        user: { type: mongoose.SchemaTypes.ObjectId, required: true },
    },
    { _id: false }
)

export const UserSchema = new mongoose.Schema<IUserModel>({
    username: { type: String, required: true, unique: true, trim: true, minlength: 3, maxlength: 30 },
    email: { type: String, required: true, unique: true, lowercase: true, match: /^\S+@\S+\.\S+$/ },
    passwordHash: { type: String },
    isOAuth: { type: Boolean, default: false },
    googleId: { type: String, unique: true, sparse: true },
    animals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Animal" }],
    avatar: { type: String, default: "%backend%/images/person_baseicon.png" },
    sessions: [SessionSchema],
    roles: { type: [String], enum: ["user", "admin"], default: ["user"] },
    createdAt: { type: Date, default: new Date() },
    lastLogin: { type: Date },
})

export default mongoose.model<IUserModel>("User", UserSchema)
