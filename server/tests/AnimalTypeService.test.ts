import { test, expect, beforeEach, afterEach } from "bun:test";
import { faker } from "@faker-js/faker/locale/en_US";
import { AnimalTypeService } from "../services/AnimalTypeService";
import { config } from "dotenv";
import { globalLogger, Logger } from "../utils/logger";
import mongoose from "mongoose";
import { describe } from "node:test";
import { BreedService } from "../services/BreedService";
import AnimalType from "../models/AnimalType";
import Breed from "../models/Breed";
config();

beforeEach(async () => {
	new Logger("/");
	await mongoose.connect(
		"mongodb://admin:password12341234@mongo:27017/pet_tracker?authSource=admin",
		{ dbName: "test", autoIndex: true },
	);
});

afterEach(async () => {
	await mongoose.connection.db.dropDatabase();
	globalLogger.logger().end();
});

describe("Create new", () => {
	test("Check create new function: should be success", async () => {
		const data = {
			name: faker.animal.type(),
			icon: faker.image.url(),
		};

		const animal_type = await AnimalTypeService.createNew(data.name, data.icon);
		expect(animal_type).toHaveProperty("_id");
		expect(animal_type).toHaveProperty("name");
		expect(animal_type).toHaveProperty("icon");
		expect(animal_type).toHaveProperty("breeds");
		expect(animal_type.name).toBe(data.name);
		expect(animal_type.icon).toBe(data.icon);
	});

	test("Check create new function: try to create two animal types with the same name", async () => {
		const data = {
			name: faker.animal.type(),
			icon: faker.image.url(),
		};

		await AnimalTypeService.createNew(data.name, data.icon);
		expect(AnimalTypeService.createNew(data.name, data.icon)).rejects.toThrow();
	});
});

describe("Delete one", () => {
	test("Check delete one function: should be success", async () => {
		const animal_type_before = await AnimalTypeService.createNew(
			"cat",
			faker.image.url(),
		);
		const breed1_before = await BreedService.createNew(faker.animal.cat(), "cat");
		const breed2_before = await BreedService.createNew(faker.animal.cat(), "cat");

		const animal_type = await AnimalType.findById(animal_type_before._id);

		expect(animal_type.breeds.length).toBe(2);

		await AnimalTypeService.deleteOne("cat");

		const breed1 = await Breed.findById(breed1_before.id);
		const breed2 = await Breed.findById(breed2_before.id);
		const animal_type_after = await AnimalType.findOne({ name: "cat" });

		expect(animal_type_after).toBeEmpty();
		expect(breed1).toBeEmpty();
		expect(breed2).toBeEmpty();
	});
	test("Check delete one function: try to delete undefined Animal Type should be failed", async () => {
		expect(AnimalTypeService.deleteOne("cat")).rejects.toThrow();
	});
});

describe("DeleteBreedFromAnimalType", () => {
	let _animal_type;
	let _breed1;
	let _breed2;
	beforeEach(async () => {
		_animal_type = await AnimalTypeService.createNew("cat", faker.image.url());
		_breed1 = await BreedService.createNew(faker.animal.cat(), "cat");
		_breed2 = await BreedService.createNew(faker.animal.cat(), "cat");
	});
	test("Check delete breed from animal type function: should be success", async () => {
		const animal_type_after = await AnimalTypeService.deleteBreedFromAnimalType(
			"cat",
			_breed1._id,
		);

		expect(animal_type_after.breeds.length).toBe(1);

		const animal_type_after2 = await AnimalTypeService.deleteBreedFromAnimalType(
			"cat",
			_breed2._id,
		);

		expect(animal_type_after2.breeds.length).toBe(0);
	});
	test("Check delete from animal type function: try to delete undefined breed", async () => {
		expect(
			AnimalTypeService.deleteBreedFromAnimalType(
				"cat",
				new mongoose.Types.ObjectId(),
			),
		).rejects.toThrow();
	});
	test("Check delete from animal type function: try to delete from undefined animal type", async () => {
		expect(
			AnimalTypeService.deleteBreedFromAnimalType("dog", _breed1._id),
		).rejects.toThrow();
	});
});

describe("Get all", () => {
	test("Check get all function: should be success", async () => {
		const _animal_type = await AnimalTypeService.createNew(
			"cat",
			faker.image.url(),
		);
		const _animal_type2 = await AnimalTypeService.createNew(
			"dog",
			faker.image.url(),
		);

		const all = await AnimalTypeService.getAll();

		expect(all.length).toBe(2);
		expect(all[0].name).toBe("cat");
		expect(all[1].name).toBe("dog");
	});
});

describe("Add breed to animal type", () => {
	test("Check addBreedToAnimalType function: try to add undefined breed to undefined animal type", async () => {
		expect(
			AnimalTypeService.addBreedToAnimalType("dog", new mongoose.Types.ObjectId()),
		).rejects.toThrow();
	});
});
