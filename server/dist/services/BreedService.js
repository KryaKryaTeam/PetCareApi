"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BreedService = void 0;
const ApiError_1 = require("../error/ApiError");
const Breed_1 = __importDefault(require("../models/Breed"));
const Injection_1 = require("../models/Injection");
const AnimalTypeService_1 = require("./AnimalTypeService");
const logger_1 = require("../utils/logger");
class BreedService {
    static async createNew(name, animalTypeName) {
        logger_1.globalLogger.logger().setService("breed_service");
        const animal_type = await AnimalTypeService_1.AnimalTypeService.findByName(animalTypeName);
        const breed = new Breed_1.default({ name, animalType: animal_type.id });
        await breed.save();
        AnimalTypeService_1.AnimalTypeService.addBreedToAnimalType(animalTypeName, breed.id);
        return breed;
    }
    static async deleteOne(breedId) {
        logger_1.globalLogger.logger().setService("breed_service");
        const breed = await Breed_1.default.findById(breedId);
        if (!breed)
            throw ApiError_1.ApiError.badrequest("breed is undefined");
        const animal_type = await AnimalTypeService_1.AnimalTypeService.findById(breed.animalType);
        await AnimalTypeService_1.AnimalTypeService.deleteBreedFromAnimalType(animal_type.name, breed.id);
        await Injection_1.PlannedInjection.deleteMany({ breed: breed._id });
        await breed.deleteOne();
        return true;
    }
    static async addRecomendationToBreed(breedId, recomendation) {
        logger_1.globalLogger.logger().setService("breed_service");
        const breed = await Breed_1.default.findById(breedId);
        if (!breed)
            throw ApiError_1.ApiError.badrequest("breed is undefined");
        breed.recomendations.push(recomendation);
        await breed.save();
        return breed;
    }
    static async deleteRecomendationFromBreed(breedId, recomendation_name) {
        logger_1.globalLogger.logger().setService("breed_service");
        const breed = await Breed_1.default.findById(breedId);
        if (!breed)
            throw ApiError_1.ApiError.badrequest("breed is undefined");
        const index = breed.recomendations.findIndex((a) => a.name == recomendation_name);
        if (index == -1)
            throw ApiError_1.ApiError.badrequest("recomendation with this name is undefined in this breed");
        breed.recomendations.splice(index, 1);
        await breed.save();
        return breed;
    }
    static async findByName(breedName) {
        logger_1.globalLogger.logger().setService("breed_service");
        const breed = await Breed_1.default.findOne({ name: breedName });
        if (!breed)
            throw ApiError_1.ApiError.badrequest("Breed with this name id undefined!");
        return breed;
    }
    static async findById(breedId) {
        logger_1.globalLogger.logger().setService("breed_service");
        const breed = await Breed_1.default.findById(breedId);
        if (!breed)
            throw ApiError_1.ApiError.badrequest("Breed with this id is undefined!");
        return breed;
    }
}
exports.BreedService = BreedService;
