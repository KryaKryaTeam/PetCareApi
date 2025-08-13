import { Types } from "mongoose"
import { ApiError } from "../error/ApiError"
import AnimalType, { IAnimalTypeModel } from "../models/AnimalType"
import { BreedService } from "./BreedService"
import Breed from "../models/Breed"
import { globalLogger } from "../utils/logger"

export class AnimalTypeService {
    static async createNew(name: string, icon?: string): Promise<IAnimalTypeModel> {
        globalLogger.logger().setService("animal_type_service")
        globalLogger.logger().info("Animal type is created")
        const animal_type = new AnimalType({ name, icon })
        await animal_type.save()

        return animal_type
    }
    static async deleteOne(name: string) {
        globalLogger.logger().setService("animal_type_service")
        globalLogger.logger().info("Animal type deleted is starts")
        const animal_type = await this.findByName(name)

        globalLogger.logger().info("Breeds deletion is starts")
        const pr = Promise.all(animal_type.breeds.map((breed) => BreedService.deleteOne(breed)))
        await pr

        await animal_type.deleteOne()
        globalLogger.logger().info("Animal type is deleted")
        return 0
    }
    static async addBreedToAnimalType(animalTypeName: string, breedId: string) {
        globalLogger.logger().setService("animal_type_service")
        const animal_type = await this.findByName(animalTypeName)

        const breed = await BreedService.findById(breedId)
        animal_type.breeds.push(breed.id)

        globalLogger.logger().info(`breed ${breedId} is added to animal type ${animalTypeName}`)
        await animal_type.save()
    }
    static async deleteBreedFromAnimalType(animalTypeName: string, breedId: string) {
        globalLogger.logger().setService("animal_type_service")
        const animal_type = await this.findByName(animalTypeName)

        const breed = await BreedService.findById(breedId)
        animal_type.breeds = animal_type.breeds.filter((a) => a != breed.id)
        await animal_type.save()

        globalLogger.logger().info(`breed ${breedId} is deleted from animal type ${animalTypeName}`)

        return animal_type
    }
    static async getAll() {
        globalLogger.logger().setService("animal_type_service")
        const types = await AnimalType.find().populate("breeds").exec()
        globalLogger.logger().info("get all animal types is success")
        return types
    }
    static async findByName(name: string) {
        globalLogger.logger().setService("animal_type_service")
        const animal_type = (await AnimalType.findOne({ name })).populate("breeds")
        if (!animal_type) throw ApiError.undefined("Animal type with this name is undefined!")
        globalLogger.logger().info(`get animal type by name ${name} is success`)
        return animal_type
    }
    static async findById(id: string | Types.ObjectId) {
        globalLogger.logger().setService("animal_type_service")
        const animal_type = await AnimalType.findById(id).populate("breeds")
        if (!animal_type) throw ApiError.undefined("Animal type with this id is undefined!")
        globalLogger.logger().info(`get animal type by id ${id} is success`)
        return animal_type
    }
}
