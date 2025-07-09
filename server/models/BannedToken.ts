import mongoose from "mongoose"

const opts = { discriminatorKey: "variant", timestamps: { createdAt: true, updatedAt: false } }

export interface IBannedToken {
    sessionId: string
    variant: "self" | "google"
    createdAt: Date
}

export interface IBannedTokenModel extends Document {
    sessionId: string
    variant: "self" | "google"
    createdAt: Date
}

export interface ISelfBannedToken {
    sessionId: string
    variant: "self"
    familyId: string
    createdAt: Date
}

export interface ISelfBannedTokenModel extends Document {
    sessionId: string
    variant: "self"
    familyId: string
    createdAt: Date
}

export interface IGoogleBannedToken {
    sessionId: string
    token: string
    createdAt: Date
}

export interface IGoogleBannedTokenModel extends Document {
    sessionId: string
    token: string
    createdAt: Date
}

const BannedTokenSchema = new mongoose.Schema<IBannedTokenModel>(
    {
        sessionId: { type: String, required: true },
    },
    opts
)

export const BannedToken = mongoose.model<IBannedTokenModel>("BannedToken", BannedTokenSchema)

export const SelfBannedToken = BannedToken.discriminator<ISelfBannedTokenModel>(
    "self",
    new mongoose.Schema(
        {
            familyId: { type: String, required: true, unqiue: true },
        },
        opts
    )
)

export const GoogleBannedToken = BannedToken.discriminator<IGoogleBannedTokenModel>(
    "google",
    new mongoose.Schema(
        {
            token: { type: String, required: true, unqiue: true },
        },
        opts
    )
)
