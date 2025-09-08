import { test, expect, beforeEach, afterEach } from "bun:test";
import { config } from "dotenv";
import { globalLogger, Logger } from "../utils/logger";
import mongoose from "mongoose";
import { describe } from "node:test";
import { AnimalTypeService } from "../services/AnimalTypeService";
import { faker } from "@faker-js/faker";
import { BreedService } from "../services/BreedService";
import Breed from "../models/Breed";
import { IRecomendation } from "../models/Breed";

config();

let _animal_type;

beforeEach(async () => {
	new Logger("/");
	await mongoose.connect(
		"mongodb://admin:password12341234@mongo:27017/pet_tracker?authSource=admin",
		{ dbName: "test", autoIndex: true },
	);

	_animal_type = await AnimalTypeService.createNew("cat", faker.image.url());
});

afterEach(async () => {
	await mongoose.connection.db.dropDatabase();
	globalLogger.logger().end();
});

describe("Create new", () => {
	test("Check create new function: should be success", async () => {
		const breed = await BreedService.createNew(faker.animal.cat(), "cat");

		expect(breed).toHaveProperty("_id");
		expect(breed).toHaveProperty("name");
		expect(breed).toHaveProperty("animalType");
		expect(breed).toHaveProperty("recomendations");
		expect(breed.name).toBe(breed.name);
		expect(breed.animalType._id.equals(_animal_type._id)).toBe(true);
	});
	test("Check create new function: try to create and add to undefined animal type", async () => {
		expect(BreedService.createNew(faker.animal.cat(), "dog")).rejects.toThrow();
	});
});

describe("Delete one", () => {
	test("Check delete one function: should be success", async () => {
		const breed = await BreedService.createNew(faker.animal.cat(), "cat");

		const breed_ext1 = await Breed.findById(breed._id);
		expect(breed_ext1).not.toBeEmpty();

		await BreedService.deleteOne(breed._id, false);

		const breed_ext2 = await Breed.findById(breed._id);
		expect(breed_ext2).toBeEmpty();
	});
	test("Check delete one function: try to delete undefined breed", async () => {
		expect(
			BreedService.deleteOne(new mongoose.Types.ObjectId(), false),
		).rejects.toThrow();
	});
});

describe("Add recomendation function", () => {
	let _breed;
	beforeEach(async () => {
		_breed = await BreedService.createNew(faker.animal.cat(), "cat");
	});
	test("Check add recomendation function: should be success", async () => {
		const data = {
			name: faker.lorem.sentence(),
			content: faker.lorem.sentences({ min: 1, max: 3 }),
		} as IRecomendation;

		await BreedService.addRecomendationToBreed(_breed._id, data);

		const breed_after = await Breed.findById(_breed._id);
		expect(breed_after.recomendations.length).toBe(1);
		expect(breed_after.recomendations[0].name).toBe(data.name);
		expect(breed_after.recomendations[0].content).toBe(data.content);
	});
	test("Check add recomendation function: try to add recomendation to undefined breed", async () => {
		const data = {
			name: faker.lorem.sentence(),
			content: faker.lorem.sentences({ min: 1, max: 3 }),
		} as IRecomendation;

		expect(
			BreedService.addRecomendationToBreed(new mongoose.Types.ObjectId(), data),
		).rejects.toThrow();
	});
});

describe("Delete recomendation function", () => {
	let _breed;
	beforeEach(async () => {
		_breed = await BreedService.createNew(faker.animal.cat(), "cat");
		const data = {
			name: "check",
			content: faker.lorem.sentences({ min: 1, max: 3 }),
		} as IRecomendation;

		await BreedService.addRecomendationToBreed(_breed._id, data);
	});
	test("Check delete recomendation from breed function: should be success", async () => {
		await BreedService.deleteRecomendationFromBreed(_breed._id, "check");

		const breed_after = await Breed.findById(_breed._id);
		expect(breed_after.recomendations.length).toBe(0);
	});
	test("Check delete recomendation from breed function: try to delete recomendation from undefined breed", async () => {
		expect(
			BreedService.deleteRecomendationFromBreed(
				new mongoose.Types.ObjectId(),
				"check",
			),
		).rejects.toThrow();
	});
	test("Check delete recomendation from breed function: try to delete undefined recomendation from defined breed", async () => {
		expect(
			BreedService.deleteRecomendationFromBreed(_breed._id, "check2"),
		).rejects.toThrow();
	});
});
describe("Get all", () => {
	test("Check get all function: should be success", async () => {
		const _breed1 = await BreedService.createNew(faker.animal.cat(), "cat");
		const _breed2 = await BreedService.createNew(faker.animal.cat(), "cat");

		const all = await BreedService.getAll();
		expect(all.length).toBe(2);
		expect(all[0].name).toBe(_breed1.name);
		expect(all[1].name).toBe(_breed2.name);
	});
});
