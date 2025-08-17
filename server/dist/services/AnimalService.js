"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimalService = void 0;
const ApiError_1 = require("../error/ApiError");
const Animal_1 = __importDefault(require("../models/Animal"));
const logger_1 = require("../utils/logger");
const AnimalTypeService_1 = require("./AnimalTypeService");
const BreedService_1 = require("./BreedService");
class AnimalService {
    static async createNew(animal_) {
        logger_1.globalLogger.logger().setService("animal_service");
        await BreedService_1.BreedService.findById(animal_.breed);
        await AnimalTypeService_1.AnimalTypeService.findById(animal_.animalType);
        const animal = new Animal_1.default(animal_);
        await animal.save();
        logger_1.globalLogger.logger().info("New animal is created");
        return animal;
    }
    static async deleteOne(owner, animal_id) {
        logger_1.globalLogger.logger().setService("animal_service");
        const animal = await this.findById_ownerCheck(animal_id, owner);
        await animal.deleteOne();
        logger_1.globalLogger.logger().info("Animal is deleted");
        return "Ok!";
    }
    static async getOne(owner, animal_id) {
        logger_1.globalLogger.logger().setService("animal_service");
        const animal = await this.findById_ownerCheck(animal_id, owner);
        logger_1.globalLogger.logger().info(`Animal ${animal_id} is successfuly finded`);
        return animal;
    }
    static async getAll(owner) {
        logger_1.globalLogger.logger().setService("animal_service");
        const animal = await Animal_1.default.find({ owner }).populate("breed").exec();
        logger_1.globalLogger.logger().info(`All animal of ${owner} is successfuly finded`);
        return animal;
    }
    static async setIsSterilized(owner, animal_id, sterilized) {
        logger_1.globalLogger.logger().setService("animal_service");
        const animal = await this.findById_ownerCheck(animal_id, owner);
        animal.isSterilized = sterilized;
        logger_1.globalLogger.logger().info("Is sterilized value is successfuly seted");
        await animal.save();
        return animal;
    }
    static async setWeight(owner, animal_id, weight) {
        logger_1.globalLogger.logger().setService("animal_service");
        const animal = await this.findById_ownerCheck(animal_id, owner);
        animal.weight = weight;
        logger_1.globalLogger.logger().info("Weight value is successfuly seted");
        await animal.save();
        return animal;
    }
    static async setGender(owner, animal_id, gender) {
        logger_1.globalLogger.logger().setService("animal_service");
        const animal = await this.findById_ownerCheck(animal_id, owner);
        animal.gender = gender;
        logger_1.globalLogger.logger().info("Gender value is successfuly seted");
        await animal.save();
        return animal;
    }
    static async setStatus(owner, animal_id, status) {
        logger_1.globalLogger.logger().setService("animal_service");
        const animal = await this.findById_ownerCheck(animal_id, owner);
        animal.status = status;
        logger_1.globalLogger.logger().info("Status value is successfuly seted");
        await animal.save();
        return animal;
    }
    static async changeAvatar(owner, animal_id, avatar) {
        logger_1.globalLogger.logger().setService("animal_service");
        const animal = await this.findById_ownerCheck(animal_id, owner);
        animal.avatar = avatar;
        logger_1.globalLogger.logger().info("Avatar value is successfuly seted");
        await animal.save();
        return animal;
    }
    static async findById(animal_id) {
        const animal = await Animal_1.default.findById(animal_id).populate("breed").exec();
        if (!animal)
            throw ApiError_1.ApiError.badrequest("Animal with this id is undefined!");
        return animal;
    }
    static async findById_ownerCheck(animal_id, owner) {
        const animal = await this.findById(animal_id);
        if (animal.owner.text == owner)
            throw ApiError_1.ApiError.forbidden("This animal is not your!");
        return animal;
    }
}
exports.AnimalService = AnimalService;
