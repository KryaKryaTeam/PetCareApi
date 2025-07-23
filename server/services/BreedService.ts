import { ApiError } from "../error/ApiError"
import AnimalType from "../models/AnimalType"
import Breed, { IBreedModel, IRecomendation } from "../models/Breed"
import { PlannedInjection } from "../models/Injection"

export class BreedService {
    static async createNew(name, animalTypeId): Promise<IBreedModel> {
        const animal_type = await AnimalType.findById(animalTypeId)
        if (!animal_type) throw ApiError.badrequest("animal type is undefined")

        const breed = new Breed({ name, animalType: animal_type._id })
        await breed.save()

        return breed
    }
    static async deleteOne(breedId): Promise<true> {
        const breed = await Breed.findById(breedId)
        if (!breed) throw ApiError.badrequest("breed is undefined")

        await PlannedInjection.deleteMany({ breed: breed._id })

        await breed.deleteOne()

        return true
    }
    static async addRecomendationToBreed(breedId: string, recomendation: IRecomendation): Promise<IBreedModel> {
        const breed = await Breed.findById(breedId)
        if (!breed) throw ApiError.badrequest("breed is undefined")

        breed.recomendations.push(recomendation)
        await breed.save()

        return breed
    }
    static async deleteRecomendationFromBreed(breedId: string, recomendation_name: string): Promise<IBreedModel> {
        const breed = await Breed.findById(breedId)
        if (!breed) throw ApiError.badrequest("breed is undefined")

        const index = breed.recomendations.findIndex((a) => a.name == recomendation_name)
        if (index == -1) throw ApiError.badrequest("recomendation with this name is undefined in this breed")

        breed.recomendations.splice(index, 1)
        await breed.save()

        return breed
    }
}
