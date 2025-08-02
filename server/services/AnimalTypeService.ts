import { Types } from "mongoose";
import { ApiError } from "../error/ApiError";
import AnimalType, { IAnimalTypeModel } from "../models/AnimalType";
import { BreedService } from "./BreedService";
import Breed from "../models/Breed";

export class AnimalTypeService {
  static async createNew(
    name: string,
    icon?: string
  ): Promise<IAnimalTypeModel> {
    const animal_type = new AnimalType({ name, icon });
    await animal_type.save();

    return animal_type;
  }
  static async deleteOne(name: string) {
    const animal_type = await this.findByName(name);

    const pr = Promise.all(
      animal_type.breeds.map((breed) => BreedService.deleteOne(breed))
    );
    await pr;

    await animal_type.deleteOne();
    return 0;
  }
  static async addBreedToAnimalType(animalTypeName: string, breedId: string) {
    const animal_type = await this.findByName(animalTypeName);

    const breed = await BreedService.findById(breedId);
    animal_type.breeds.push(breed.id);

    await animal_type.save();
  }
  static async deleteBreedFromAnimalType(
    animalTypeName: string,
    breedId: string
  ) {
    const animal_type = await this.findByName(animalTypeName);

    const breed = await BreedService.findById(breedId);
    animal_type.breeds = animal_type.breeds.filter((a) => a != breed.id);
    await animal_type.save();

    return animal_type;
  }
  static async getAll() {
    const types = await AnimalType.find().populate("breeds").exec();
    return types;
  }
  static async findByName(name: string) {
    const animal_type = (await AnimalType.findOne({ name })).populate("breeds");
    if (!animal_type)
      throw ApiError.undefined("Animal type with this name is undefined!");
    return animal_type;
  }
  static async findById(id: string | Types.ObjectId) {
    const animal_type = await AnimalType.findById(id).populate("breeds");
    if (!animal_type)
      throw ApiError.undefined("Animal type with this id is undefined!");
    return animal_type;
  }
}
