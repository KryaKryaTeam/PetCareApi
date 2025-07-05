import mongoose from "mongoose"

const opts = { discriminatorKey: "variant", timestamps: { createdAt: true, updatedAt: false } }

export type InjectionVariants = "planned" | "additional" | "record"

interface IInjectionBase {
    name: String
    variant: InjectionVariants
    note?: String
}

interface IInjectionBaseModel extends Document {
    name: String
    variant: InjectionVariants
    note?: String
}

export interface IPlannedInjection extends IInjectionBase {
    variant: "planned"
    breed: String
    recomendatrionsAtWeeks: Number
}

export interface IAdditionalInjection extends IInjectionBase {
    variant: "additional"
    animal: String
    recomendatrionsAtWeeks: Number
}

export interface IRecordInjection extends IInjectionBase {
    variant: "record"
    animal: String
    injectionRef: String
    recomendatrionsAtWeeks: Number
}

export interface IPlannedInjectionModel extends IInjectionBaseModel {
    variant: "planned"
    breed: String
    recomendatrionsAtWeeks: Number
}

export interface IAdditionalInjectionModel extends IInjectionBaseModel {
    variant: "additional"
    animal: String
    recomendatrionsAtWeeks: Number
}

export interface IRecordInjectionModel extends IInjectionBaseModel {
    variant: "record"
    animal: String
    injectionRef: String
    recomendatrionsAtWeeks: Number
}

const InjectionBaseSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        note: { type: String },
    },
    opts
)

export const Injection = mongoose.model("Injection", InjectionBaseSchema)

export const PlannedInjection = Injection.discriminator(
    "planned",
    new mongoose.Schema(
        {
            breed: { type: mongoose.Schema.Types.ObjectId, ref: "Breed", required: true },
            recommendedAtWeeks: { type: Number, required: true },
        },
        opts
    )
)

export const AdditionalInjection = Injection.discriminator(
    "additional",
    new mongoose.Schema(
        {
            animal: { type: mongoose.Schema.Types.ObjectId, ref: "Animal", required: true },
            recommendedAtWeeks: { type: Number, required: true },
        },
        opts
    )
)

export const InjectionRecord = Injection.discriminator(
    "record",
    new mongoose.Schema(
        {
            animal: { type: mongoose.Schema.Types.ObjectId, ref: "Animal", required: true },
            injectionRef: { type: mongoose.Schema.Types.ObjectId, ref: "Injection", required: true },
            performedAt: { type: Date, required: true },
        },
        opts
    )
)

export type IInjection = IPlannedInjection | IAdditionalInjection | IRecordInjection
export type IInjectionModel = IPlannedInjectionModel | IAdditionalInjectionModel | IRecordInjectionModel
