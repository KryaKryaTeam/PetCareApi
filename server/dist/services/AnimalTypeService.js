"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimalTypeService = void 0;
const ApiError_1 = require("../error/ApiError");
const AnimalType_1 = __importDefault(require("../models/AnimalType"));
const BreedService_1 = require("./BreedService");
const logger_1 = require("../utils/logger");
class AnimalTypeService {
    static async createNew(name, icon) {
        logger_1.globalLogger.logger().setService("animal_type_service");
        logger_1.globalLogger.logger().info("Animal type is created");
        const animal_type = new AnimalType_1.default({ name, icon });
        await animal_type.save();
        return animal_type;
    }
    static async deleteOne(name) {
        logger_1.globalLogger.logger().setService("animal_type_service");
        logger_1.globalLogger.logger().info("Animal type deleted is starts");
        const animal_type = await this.findByName(name);
        logger_1.globalLogger.logger().info("Breeds deletion is starts");
        const pr = Promise.all(animal_type.breeds.map((breed) => BreedService_1.BreedService.deleteOne(breed)));
        await pr;
        await animal_type.deleteOne();
        logger_1.globalLogger.logger().info("Animal type is deleted");
        return 0;
    }
    static async addBreedToAnimalType(animalTypeName, breedId) {
        logger_1.globalLogger.logger().setService("animal_type_service");
        const animal_type = await this.findByName(animalTypeName);
        const breed = await BreedService_1.BreedService.findById(breedId);
        animal_type.breeds.push(breed.id);
        logger_1.globalLogger.logger().info(`breed ${breedId} is added to animal type ${animalTypeName}`);
        await animal_type.save();
    }
    static async deleteBreedFromAnimalType(animalTypeName, breedId) {
        logger_1.globalLogger.logger().setService("animal_type_service");
        const animal_type = await this.findByName(animalTypeName);
        const breed = await BreedService_1.BreedService.findById(breedId);
        animal_type.breeds = animal_type.breeds.filter((a) => a != breed.id);
        await animal_type.save();
        logger_1.globalLogger.logger().info(`breed ${breedId} is deleted from animal type ${animalTypeName}`);
        return animal_type;
    }
    static async getAll() {
        logger_1.globalLogger.logger().setService("animal_type_service");
        const types = await AnimalType_1.default.find().populate("breeds").exec();
        logger_1.globalLogger.logger().info("get all animal types is success");
        return types;
    }
    static async findByName(name) {
        logger_1.globalLogger.logger().setService("animal_type_service");
        const animal_type = (await AnimalType_1.default.findOne({ name })).populate("breeds");
        if (!animal_type)
            throw ApiError_1.ApiError.undefined("Animal type with this name is undefined!");
        logger_1.globalLogger.logger().info(`get animal type by name ${name} is success`);
        return animal_type;
    }
    static async findById(id) {
        logger_1.globalLogger.logger().setService("animal_type_service");
        const animal_type = await AnimalType_1.default.findById(id).populate("breeds");
        if (!animal_type)
            throw ApiError_1.ApiError.undefined("Animal type with this id is undefined!");
        logger_1.globalLogger.logger().info(`get animal type by id ${id} is success`);
        return animal_type;
    }
}
exports.AnimalTypeService = AnimalTypeService;
