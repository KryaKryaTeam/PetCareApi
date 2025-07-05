import type { ObjectId } from "mongoose"
import AnimalTypeModel from "../models/AnimalType"
import type { IAnimalType, IAnimalTypeModel } from "../models/AnimalType"

export class AnimalTypeService {
    static async GetNameFromId(animalTypeId: String): Promise<String | null> {
        return await AnimalTypeModel.findById(animalTypeId).then((doc) => doc?.name || "")
    }
    static async createAnimalType(animalType: IAnimalType): Promise<IAnimalTypeModel> {
        const animalType_ToCreate = new AnimalTypeModel({ ...animalType })
        await animalType_ToCreate.save()
        return animalType_ToCreate
    }
    static async changeAnimalBreeds(animalTypeName: String, NewBreeds: String[]): Promise<IAnimalType> {
        const Animal_type = await AnimalTypeModel.findOne({ name: animalTypeName })
        return await Animal_type?.updateOne({ breeds: NewBreeds })
    }
    static async getBreedsByName(name: String): Promise<ObjectId[]> {
        const Animal_type = await AnimalTypeModel.findOne({ name })
        return Animal_type?.breeds || []
    }
    static async getAllAnimalTypes(): Promise<IAnimalTypeModel[]> {
        const res = await AnimalTypeModel.find()
        return res
    }
    static async deleteAnimalType(name: String): Promise<number> {
        const animaltype_ = await AnimalTypeModel.findOne({ name })
        if (!animaltype_) return 0
        await animaltype_.deleteOne()
        return 1
    }
}
