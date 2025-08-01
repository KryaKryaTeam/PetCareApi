import mongoose from "mongoose"
import type { ObjectId } from "mongoose"
import type { Document } from "mongoose"

export interface IDocumentField {
    name: string
    data: string
    type?: string
}
export interface IDocument {
    title: string
    fileUrl: string
    animal: string
    owner: string
    uploadedAt: Date
    status: "active" | "archived"
    fields: IDocumentField[]
}
export interface IDocumentModel extends Document {
    title: string
    fileUrl: string
    animal: ObjectId
    owner: ObjectId
    uploadedAt: Date
    status: "active" | "archived"
    fields: IDocumentField[]
}

const FieldSchema = new mongoose.Schema<IDocumentField>(
    {
        name: { type: String, required: true },
        data: { type: String, required: true },
        type: { type: String },
    },
    { _id: false }
)

const DocumentSchema = new mongoose.Schema<IDocumentModel>({
    title: { type: String, required: true, trim: true },
    fileUrl: { type: String, required: true },
    animal: { type: mongoose.Schema.Types.ObjectId, ref: "Animal", required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    uploadedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ["active", "archived"], default: "active" },
    fields: [FieldSchema],
})

export default mongoose.model<IDocumentModel>("Document", DocumentSchema)
