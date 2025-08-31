import mongoose, { Types, Number } from "mongoose";
import type { Document } from "mongoose";

const opts = {
	discriminatorKey: "variant",
	timestamps: { createdAt: true, updatedAt: false },
};

export type InjectionVariants = "planned" | "additional" | "record";

interface IInjectionBase {
	name: string;
	variant: InjectionVariants;
	note?: string;
}

interface IInjectionBaseModel extends Document {
	name: string;
	variant: InjectionVariants;
	note?: string;
}

export interface IPlannedInjection extends IInjectionBase {
	variant: "planned";
	breed: string;
	recomendatrionsAtWeeks: Number;
}

export interface IAdditionalInjection extends IInjectionBase {
	variant: "additional";
	animal: string;
	recomendatrionsAtWeeks: Number;
}

export interface IRecordInjection extends IInjectionBase {
	variant: "record";
	animal: string;
	injectionRef: string;
	recomendatrionsAtWeeks: Number;
}

export interface IPlannedInjectionModel extends IInjectionBaseModel {
	variant: "planned";
	breed: Types.ObjectId;
	recomendatrionsAtWeeks: Number;
}

export interface IAdditionalInjectionModel extends IInjectionBaseModel {
	variant: "additional";
	animal: Types.ObjectId;
	recomendatrionsAtWeeks: Number;
}

export interface IRecordInjectionModel extends IInjectionBaseModel {
	variant: "record";
	animal: Types.ObjectId;
	injectionRef: Types.ObjectId;
	recomendatrionsAtWeeks: Number;
}

const InjectionBaseSchema = new mongoose.Schema(
	{
		name: { type: String, required: true, trim: true },
		note: { type: String },
	},
	opts,
);

export const Injection = mongoose.model("Injection", InjectionBaseSchema);

export const PlannedInjection = Injection.discriminator(
	"planned",
	new mongoose.Schema(
		{
			breed: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Breed",
				required: true,
			},
			recommendedAtWeeks: { type: Number, required: true },
		},
		opts,
	),
);

export const AdditionalInjection = Injection.discriminator(
	"additional",
	new mongoose.Schema(
		{
			animal: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Animal",
				required: true,
			},
			recommendedAtWeeks: { type: Number, required: true },
		},
		opts,
	),
);

export const InjectionRecord = Injection.discriminator(
	"record",
	new mongoose.Schema(
		{
			animal: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Animal",
				required: true,
			},
			injectionRef: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Injection",
				required: true,
			},
			performedAt: { type: Date, required: true },
		},
		opts,
	),
);

export type IInjection =
	| IPlannedInjection
	| IAdditionalInjection
	| IRecordInjection;
export type IInjectionModel =
	| IPlannedInjectionModel
	| IAdditionalInjectionModel
	| IRecordInjectionModel;
