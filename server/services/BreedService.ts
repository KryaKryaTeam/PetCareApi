import { ApiError } from "../error/ApiError";
import Breed, { IBreedModel, IRecomendation } from "../models/Breed";
import { PlannedInjection } from "../models/Injection";
import { AnimalTypeService } from "./AnimalTypeService";
import { globalLogger } from "../utils/logger";
import { Types } from "mongoose";

export class BreedService {
	static async createNew(name, animalTypeName): Promise<IBreedModel> {
		globalLogger.logger().setService("breed_service");

		const animal_type = await AnimalTypeService.findByName(animalTypeName);
		const breed = new Breed({ name, animalType: animal_type.id });
		await breed.save();

		await AnimalTypeService.addBreedToAnimalType(animalTypeName, breed.id);

		return breed;
	}
	static async deleteOne(breedId, toDeleteAnimalType: boolean): Promise<true> {
		globalLogger.logger().setService("breed_service");

		const breed = await Breed.findById(breedId);
		if (!breed) throw ApiError.badrequest("breed is undefined");

		const animal_type = await AnimalTypeService.findById(breed.animalType);
		if (!toDeleteAnimalType)
			await AnimalTypeService.deleteBreedFromAnimalType(
				animal_type.name,
				breed.id,
			);
		await PlannedInjection.deleteMany({ breed: breed._id });

		await breed.deleteOne();

		return true;
	}
	static async addRecomendationToBreed(
		breedId: Types.ObjectId | string,
		recomendation: IRecomendation,
	): Promise<IBreedModel> {
		globalLogger.logger().setService("breed_service");

		const breed = await Breed.findById(breedId);
		if (!breed) throw ApiError.badrequest("breed is undefined");

		breed.recomendations.push(recomendation);
		await breed.save();

		return breed;
	}
	static async deleteRecomendationFromBreed(
		breedId: Types.ObjectId | string,
		recomendation_name: string,
	): Promise<IBreedModel> {
		globalLogger.logger().setService("breed_service");

		const breed = await Breed.findById(breedId);
		if (!breed) throw ApiError.badrequest("breed is undefined");

		const index = breed.recomendations.findIndex(
			(a) => a.name == recomendation_name,
		);
		if (index == -1)
			throw ApiError.badrequest(
				"recomendation with this name is undefined in this breed",
			);

		breed.recomendations = breed.recomendations.filter(
			(a) => a.name != recomendation_name,
		);
		await breed.save();

		return breed;
	}
	static async findByName(breedName: string): Promise<IBreedModel> {
		globalLogger.logger().setService("breed_service");

		const breed = await Breed.findOne({ name: breedName });
		if (!breed) throw ApiError.badrequest("Breed with this name is undefined!");
		return breed;
	}
	static async findById(breedId: Types.ObjectId): Promise<IBreedModel> {
		globalLogger.logger().setService("breed_service");

		const breed = await Breed.findById(breedId);

		if (!breed) throw ApiError.badrequest("Breed with this id is undefined!");

		globalLogger.logger().info(`Breed ${breedId} is finded: ${breed.name}`);
		return breed;
	}
	static async getAll() {
		globalLogger.logger().setService("breed_service");

		const breeds = await Breed.find();
		return breeds;
	}
}
