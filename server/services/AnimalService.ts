import { ApiError } from "../error/ApiError";
import Animal, { animal_gender } from "../models/Animal";
import { globalLogger } from "../utils/logger";
import { AnimalTypeService } from "./AnimalTypeService";
import { BreedService } from "./BreedService";

export interface ArgAnimalModel {
  name: string;
  weight: number;
  breed: string;
  animalType: string;
  birthDate: Date;
  isSterilized: boolean;
  owner: string;
  avatar?: string;
  gender: animal_gender;
  chipId?: string;
}

export class AnimalService {
  static async createNew(animal_: ArgAnimalModel) {
    globalLogger.logger().setService("animal_service");
    await BreedService.findById(animal_.breed);
    await AnimalTypeService.findById(animal_.animalType);

    const animal = new Animal(animal_);
    await animal.save();

    globalLogger.logger().info("New animal is created");

    return animal;
  }
  static async deleteOne(owner, animal_id) {
    globalLogger.logger().setService("animal_service");
    const animal = await this.findById_ownerCheck(animal_id, owner);

    await animal.deleteOne();

    globalLogger.logger().info("Animal is deleted");

    return "Ok!";
  }
  static async getOne(owner, animal_id) {
    globalLogger.logger().setService("animal_service");
    const animal = await this.findById_ownerCheck(animal_id, owner);

    globalLogger.logger().info(`Animal ${animal_id} is successfuly finded`);

    return animal;
  }
  static async getAll(owner) {
    globalLogger.logger().setService("animal_service");
    const animal = await Animal.find({ owner }).populate("breed").exec();

    globalLogger.logger().info(`All animal of ${owner} is successfuly finded`);

    return animal;
  }
  static async setIsSterilized(owner, animal_id, sterilized: boolean) {
    globalLogger.logger().setService("animal_service");
    const animal = await this.findById_ownerCheck(animal_id, owner);
    animal.isSterilized = sterilized;

    globalLogger.logger().info("Is sterilized value is successfuly seted");

    await animal.save();
    return animal;
  }
  static async setWeight(owner, animal_id, weight: number) {
    globalLogger.logger().setService("animal_service");
    const animal = await this.findById_ownerCheck(animal_id, owner);
    animal.weight = weight;

    globalLogger.logger().info("Weight value is successfuly seted");

    await animal.save();
    return animal;
  }
  static async setGender(
    owner,
    animal_id,
    gender: "male" | "female" | "unknown"
  ) {
    globalLogger.logger().setService("animal_service");
    const animal = await this.findById_ownerCheck(animal_id, owner);
    animal.gender = gender;

    globalLogger.logger().info("Gender value is successfuly seted");

    await animal.save();
    return animal;
  }
  static async setStatus(owner, animal_id, status) {
    globalLogger.logger().setService("animal_service");
    const animal = await this.findById_ownerCheck(animal_id, owner);
    animal.status = status;

    globalLogger.logger().info("Status value is successfuly seted");

    await animal.save();
    return animal;
  }
  static async changeAvatar(owner, animal_id, avatar) {
    globalLogger.logger().setService("animal_service");
    const animal = await this.findById_ownerCheck(animal_id, owner);
    animal.avatar = avatar;

    globalLogger.logger().info("Avatar value is successfuly seted");

    await animal.save();
    return animal;
  }
  static async findById(animal_id) {
    const animal = await Animal.findById(animal_id).populate("breed").exec();
    if (!animal) throw ApiError.badrequest("Animal with this id is undefined!");
    return animal;
  }
  static async findById_ownerCheck(animal_id, owner) {
    const animal = await this.findById(animal_id);
    if (animal.owner.text == owner)
      throw ApiError.forbidden("This animal is not your!");
    return animal;
  }
}
