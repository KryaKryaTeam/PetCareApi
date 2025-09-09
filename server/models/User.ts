import mongoose from "mongoose";
import type { Document } from "mongoose";

export interface IAuthSource<T = unknown> {
	provider: string;
	data: T;
}

export interface IUserSession {
	source: string;
	sessionId: string;
	familyId: string;
	user: mongoose.Types.ObjectId;
	device?: string;
	ip?: string;
	createdAt: Date;
	expiresAt?: Date | null;
}

export interface IUser {
	username: string;
	email: string;
	authSources: IAuthSource[];
	animals?: string[];
	avatar?: string;
	sessions?: IUserSession[];
	roles?: ("user" | "admin")[];
	createdAt?: Date;
	lastLogin?: Date;
}

export interface IUserModel extends Document {
	username: string;
	email: string;
	authSources: IAuthSource[];
	animals?: string[];
	avatar?: string;
	sessions?: IUserSession[];
	roles?: ("user" | "admin")[];
	createdAt?: Date;
	lastLogin?: Date;
}

const SessionSchema = new mongoose.Schema<IUserSession>(
	{
		source: { type: String, required: true },
		sessionId: { type: String, required: true },
		familyId: { type: String, required: true },
		device: { type: String },
		ip: { type: String },
		createdAt: { type: Date, default: new Date() },
		expiresAt: { type: Date },
		user: { type: mongoose.SchemaTypes.ObjectId, required: true },
	},
	{ _id: false },
);

const AuthSourceSchema = new mongoose.Schema<IAuthSource>({
	provider: {
		type: String,
		required: true,
		unique: true,
	},
	data: {
		type: mongoose.SchemaTypes.Mixed,
		required: true,
	},
});

export const UserSchema = new mongoose.Schema<IUserModel>({
	username: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		minlength: 3,
		maxlength: 100,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		match: /^\S+@\S+\.\S+$/,
	},
	authSources: [{ type: AuthSourceSchema }],
	animals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Animal" }],
	avatar: { type: String, default: "%backend%/images/person_baseicon.png" },
	sessions: [SessionSchema],
	roles: { type: [String], enum: ["user", "admin"], default: ["user"] },
	createdAt: { type: Date, default: new Date() },
	lastLogin: { type: Date },
});

export default mongoose.model<IUserModel>("User", UserSchema);
