import mongoose from "mongoose";
import type { ObjectId } from "mongoose";

export interface INote {
	text: string;
	author: string;
	createdAt: Date;
}

export interface INoteModel {
	text: string;
	author: ObjectId;
	createdAt: Date;
}

const NoteSchema = new mongoose.Schema<INoteModel>({
	text: {
		type: String,
		required: true,
		trim: true,
		max: 2000,
	},
	author: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: "User",
		required: true,
	},
	createdAt: {
		type: Date,
		default: new Date(),
	},
});

export default mongoose.model<INoteModel>("Note", NoteSchema);
