import { Types } from "mongoose";
import { ApiError } from "../error/ApiError";
import AnimalType, { IAnimalTypeModel } from "../models/AnimalType";
import { BreedService } from "./BreedService";
import { globalLogger } from "../utils/logger";
import { IBreedModel } from "../models/Breed";

export class AnimalTypeService {
	static async createNew(
		name: string,
		icon?: string,
	): Promise<IAnimalTypeModel> {
		globalLogger.logger().setService("animal_type_service");
		globalLogger.logger().info("Animal type is created");
		const check = await AnimalType.findOne({ name });
		if (check)
			throw ApiError.badrequest(
				"Validation error an animal type with the same name is already created!",
			);
		const animal_type = new AnimalType({ name, icon });
		await animal_type.save();

		return animal_type;
	}
	static async deleteOne(name: string) {
		globalLogger.logger().setService("animal_type_service");
		globalLogger.logger().info("Animal type deleted is starts");
		const animal_type = await this.findByName(name);

		globalLogger.logger().info("Breeds deletion is starts");
		const pr = Promise.all(
			animal_type.breeds.map(async (breed) => {
				await BreedService.deleteOne(breed, true);
			}),
		);
		await pr;

		await AnimalType.findByIdAndDelete(animal_type._id);
		globalLogger.logger().info("Animal type is deleted");
		return 0;
	}
	static async addBreedToAnimalType(
		animalTypeName: string,
		breedId: Types.ObjectId,
	) {
		globalLogger.logger().setService("animal_type_service");
		const animal_type = await this.findByName(animalTypeName);

		const breed = await BreedService.findById(breedId);
		animal_type.breeds.push(breed.id);

		globalLogger
			.logger()
			.info(`breed ${breed._id} is added to animal type ${animalTypeName}`);
		await animal_type.save();
	}
	static async deleteBreedFromAnimalType(
		animalTypeName: string,
		breedId: Types.ObjectId,
	) {
		globalLogger.logger().setService("animal_type_service");
		const animal_type = await this.findByName(animalTypeName);

		console.log(animal_type.breeds);

		const breed = (await BreedService.findById(breedId)) as IBreedModel;

		animal_type.breeds = animal_type.breeds.filter((a) => !a.equals(breed.id));

		console.log(animal_type.breeds);

		await animal_type.save();

		globalLogger
			.logger()
			.info(
				`The breed with id ${breedId} is deleted from ${animal_type.name} now breeds length is ${animal_type.breeds.length}`,
			);

		return animal_type;
	}
	static async getAll() {
		globalLogger.logger().setService("animal_type_service");
		const types = await AnimalType.find().populate("breeds").exec();
		globalLogger.logger().info("get all animal types is success");
		return types;
	}
	static async findByName(name: string) {
		globalLogger.logger().setService("animal_type_service");
		const animal_type = await AnimalType.findOne({ name })
			.populate("breeds")
			.exec();
		if (!animal_type)
			throw ApiError.badrequest("Animal type with this name is undefined!");
		globalLogger.logger().info(`get animal type by name ${name} is success`);
		return animal_type;
	}
	static async findById(id: string | Types.ObjectId) {
		globalLogger.logger().setService("animal_type_service");
		const animal_type = await AnimalType.findById(id).populate("breeds");
		if (!animal_type)
			throw ApiError.badrequest("Animal type with this id is undefined!");
		globalLogger.logger().info(`get animal type by id ${id} is success`);
		return animal_type;
	}
}
