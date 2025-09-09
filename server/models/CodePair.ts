import mongoose from "mongoose";

export interface ICodePair<T = unknown> {
	cookieCode: string;
	clientCode: number;
	data: T;
	createdAt: Date;
}

const schema = new mongoose.Schema<ICodePair>({
	cookieCode: { type: String, required: true, unique: true, min: 32 },
	clientCode: {
		type: Number,
		required: true,
		unique: true,
		min: 99999,
		max: 999999,
	},
	data: { type: mongoose.SchemaTypes.Mixed, required: true },
	createdAt: { type: Date, default: Date.now },
});

export const CodePair = mongoose.model("CodePair", schema);
