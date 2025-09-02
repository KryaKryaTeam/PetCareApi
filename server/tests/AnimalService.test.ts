import { afterEach, beforeEach, expect, test } from "bun:test";
import { AnimalService, ArgAnimalModel } from "../services/AnimalService";
import { faker } from "@faker-js/faker";
import { custom_faker } from "../utils/faker";
import { globalLogger, Logger } from "../utils/logger";
import mongoose from "mongoose";
import { config } from "dotenv";
import { BreedService } from "../services/BreedService";
import { AnimalTypeService } from "../services/AnimalTypeService";
import { AuthServiceSelf } from "../services/auth/AuthService";
import User from "../models/User";
import Animal from "../models/Animal";

let animaltype;
let owner;
let breed;

let animaltype2;
let owner2;
let breed2;

config();

let db: mongoose.Mongoose;

beforeEach(async () => {
  globalLogger.set(new Logger("/"));
  db = await mongoose.connect(
    "mongodb://admin:password12341234@mongo:27017/pet_tracker?authSource=admin",
    { dbName: "test" }
  );

  animaltype = await AnimalTypeService.createNew("cat", faker.image.avatar());
  breed = await BreedService.createNew(faker.animal.cat(), "cat");
  const username = faker.internet.username();
  await AuthServiceSelf.register(
    username,
    faker.internet.password(),
    faker.internet.email(),
    faker.internet.userAgent(),
    faker.internet.ipv6()
  );
  owner = await User.findOne({ username });

  animaltype2 = await AnimalTypeService.createNew("dog", faker.image.avatar());
  breed2 = await BreedService.createNew(faker.animal.dog(), "dog");
  const username2 = faker.internet.username();
  await AuthServiceSelf.register(
    username2,
    faker.internet.password(),
    faker.internet.email(),
    faker.internet.userAgent(),
    faker.internet.ipv6()
  );
  owner2 = await User.findOne({ username2 });
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

test("Check create new function: success case", async () => {
  const data: ArgAnimalModel = {
    name: faker.animal.petName(),
    gender: custom_faker.animal.gender(),
    weight: custom_faker.animal.weight(),
    birthDate: faker.date.birthdate(),
    isSterilized: custom_faker.animal.isSterilized(),
    chipId: custom_faker.animal.chipId(),
    avatar: faker.image.avatar(),
    animalType: animaltype._id,
    breed: breed._id,
    owner: owner._id,
  };

  const animal = await AnimalService.createNew(data);
  expect(animal).toBeObject();
  expect(animal).toHaveProperty("_id");
  expect(animal).toHaveProperty("name");
  expect(animal).toHaveProperty("weight");
  expect(animal).toHaveProperty("birthDate");
  expect(animal).toHaveProperty("isSterilized");
  expect(animal).toHaveProperty("chipId");
  expect(animal).toHaveProperty("avatar");
  expect(animal).toHaveProperty("animalType");
  expect(animal).toHaveProperty("breed");
  expect(animal).toHaveProperty("owner");
  expect(animal.id).toBeString();
  expect(animal.name).toBeString();
  expect(animal.name).toBe(data.name);
  expect(animal.gender).toBeString();
  expect(animal.weight).toBeNumber();
  expect(animal.weight).toBeGreaterThan(0);
  expect(animal.weight).toBeLessThan(100);
  expect(animal.birthDate).toBeDate();
  expect(animal.isSterilized).toBeBoolean();
  expect(animal.chipId).toBeString();
  expect(animal.chipId).toHaveLength(15);
  expect(animal.avatar).toBeString();
  expect(mongoose.isValidObjectId(animal.animalType)).toBeTrue();
  expect(mongoose.isValidObjectId(animal.breed)).toBeTrue();
  expect(mongoose.isValidObjectId(animal.owner)).toBeTrue();
});

test("Check create new function: try to create two with the same name and chipId should be success", async () => {
  const data: ArgAnimalModel = {
    name: faker.animal.petName(),
    gender: custom_faker.animal.gender(),
    weight: custom_faker.animal.weight(),
    birthDate: faker.date.birthdate(),
    isSterilized: custom_faker.animal.isSterilized(),
    chipId: custom_faker.animal.chipId(),
    avatar: faker.image.avatar(),
    animalType: animaltype._id,
    breed: breed._id,
    owner: owner._id,
  };
  const animal = await AnimalService.createNew(data);
  const animal2 = await AnimalService.createNew(data);

  expect(animal.name == animal2.name).toBeTrue();
});

test("Check delete function: try to delete should be success", async () => {
  const data: ArgAnimalModel = {
    name: faker.animal.petName(),
    gender: custom_faker.animal.gender(),
    weight: custom_faker.animal.weight(),
    birthDate: faker.date.birthdate(),
    isSterilized: custom_faker.animal.isSterilized(),
    chipId: custom_faker.animal.chipId(),
    avatar: faker.image.avatar(),
    animalType: animaltype._id,
    breed: breed._id,
    owner: owner._id,
  };
  const animal = await AnimalService.createNew(data);

  const del = await AnimalService.deleteOne(owner, animal._id);

  const animal_check = await Animal.findById(animal._id);
  expect(animal_check).toBeNull();
});

test("Check delete function: try to delete with other owner should be failed", async () => {
  const data: ArgAnimalModel = {
    name: faker.animal.petName(),
    gender: custom_faker.animal.gender(),
    weight: custom_faker.animal.weight(),
    birthDate: faker.date.birthdate(),
    isSterilized: custom_faker.animal.isSterilized(),
    chipId: custom_faker.animal.chipId(),
    avatar: faker.image.avatar(),
    animalType: animaltype._id,
    breed: breed._id,
    owner: owner._id,
  };
  const animal = await AnimalService.createNew(data);

  expect(AnimalService.deleteOne(owner2, animal._id)).rejects.toThrow();

  const animal_check = await Animal.findById(animal._id);
  expect(animal_check).toBeObject();
});

test("Check get one function: must be success", async () => {
  const data: ArgAnimalModel = {
    name: faker.animal.petName(),
    gender: custom_faker.animal.gender(),
    weight: custom_faker.animal.weight(),
    birthDate: faker.date.birthdate(),
    isSterilized: custom_faker.animal.isSterilized(),
    chipId: custom_faker.animal.chipId(),
    avatar: faker.image.avatar(),
    animalType: animaltype._id,
    breed: breed._id,
    owner: owner._id,
  };
  const animal = await AnimalService.createNew(data);

  const animal2 = await AnimalService.getOne(owner, animal._id);

  expect(animal.name == animal2.name).toBeTrue();
});

test("Check get one function: must be failed", async () => {
  const data: ArgAnimalModel = {
    name: faker.animal.petName(),
    gender: custom_faker.animal.gender(),
    weight: custom_faker.animal.weight(),
    birthDate: faker.date.birthdate(),
    isSterilized: custom_faker.animal.isSterilized(),
    chipId: custom_faker.animal.chipId(),
    avatar: faker.image.avatar(),
    animalType: animaltype._id,
    breed: breed._id,
    owner: owner._id,
  };
  const animal = await AnimalService.createNew(data);

  expect(AnimalService.getOne(owner2, animal._id)).rejects.toThrow();
});

test("Check get all function: returns correct number of animals", async () => {
  const data1: ArgAnimalModel = {
    name: faker.animal.petName(),
    gender: custom_faker.animal.gender(),
    weight: custom_faker.animal.weight(),
    birthDate: faker.date.birthdate(),
    isSterilized: custom_faker.animal.isSterilized(),
    chipId: custom_faker.animal.chipId(),
    avatar: faker.image.avatar(),
    animalType: animaltype._id,
    breed: breed._id,
    owner: owner._id,
  };
  const data2: ArgAnimalModel = {
    name: faker.animal.petName(),
    gender: custom_faker.animal.gender(),
    weight: custom_faker.animal.weight(),
    birthDate: faker.date.birthdate(),
    isSterilized: custom_faker.animal.isSterilized(),
    chipId: custom_faker.animal.chipId(),
    avatar: faker.image.avatar(),
    animalType: animaltype._id,
    breed: breed._id,
    owner: owner._id,
  };
  await AnimalService.createNew(data1);
  await AnimalService.createNew(data2);

  const animals = await AnimalService.getAll(owner);

  expect(animals).toBeArray();
  expect(animals.length).toBe(2);
  expect(animals[0]).toHaveProperty("name");
  expect(animals[1]).toHaveProperty("name");
});

test("Check get all function: returns empty array for owner with no animals", async () => {
  const animals = await AnimalService.getAll(owner2);
  expect(animals).toBeArray();
  expect(animals.length).toBe(0);
});

test("Check setIsSterilized: updates sterilization status", async () => {
  const data: ArgAnimalModel = {
    name: faker.animal.petName(),
    gender: custom_faker.animal.gender(),
    weight: custom_faker.animal.weight(),
    birthDate: faker.date.birthdate(),
    isSterilized: false,
    chipId: custom_faker.animal.chipId(),
    avatar: faker.image.avatar(),
    animalType: animaltype._id,
    breed: breed._id,
    owner: owner._id,
  };
  const animal = await AnimalService.createNew(data);
  const updated = await AnimalService.setIsSterilized(owner, animal._id, true);
  expect(updated.isSterilized).toBeTrue();
});

test("Check setWeight: updates weight", async () => {
  const data: ArgAnimalModel = {
    name: faker.animal.petName(),
    gender: custom_faker.animal.gender(),
    weight: 5,
    birthDate: faker.date.birthdate(),
    isSterilized: false,
    chipId: custom_faker.animal.chipId(),
    avatar: faker.image.avatar(),
    animalType: animaltype._id,
    breed: breed._id,
    owner: owner._id,
  };
  const animal = await AnimalService.createNew(data);
  const updated = await AnimalService.setWeight(owner, animal._id, 10);
  expect(updated.weight).toBe(10);
});

test("Check setGender: updates gender", async () => {
  const data: ArgAnimalModel = {
    name: faker.animal.petName(),
    gender: "unknown",
    weight: custom_faker.animal.weight(),
    birthDate: faker.date.birthdate(),
    isSterilized: false,
    chipId: custom_faker.animal.chipId(),
    avatar: faker.image.avatar(),
    animalType: animaltype._id,
    breed: breed._id,
    owner: owner._id,
  };
  const animal = await AnimalService.createNew(data);
  const updated = await AnimalService.setGender(owner, animal._id, "female");
  expect(updated.gender).toBe("female");
});

test("Check changeAvatar: updates avatar", async () => {
  const data: ArgAnimalModel = {
    name: faker.animal.petName(),
    gender: custom_faker.animal.gender(),
    weight: custom_faker.animal.weight(),
    birthDate: faker.date.birthdate(),
    isSterilized: false,
    chipId: custom_faker.animal.chipId(),
    avatar: "old_avatar.png",
    animalType: animaltype._id,
    breed: breed._id,
    owner: owner._id,
  };
  const animal = await AnimalService.createNew(data);
  const newAvatar = "new_avatar.png";
  const updated = await AnimalService.changeAvatar(
    owner,
    animal._id,
    newAvatar
  );
  expect(updated.avatar).toBe(newAvatar);
});

test("Check setStatus: updates status", async () => {
  const data: ArgAnimalModel = {
    name: faker.animal.petName(),
    gender: custom_faker.animal.gender(),
    weight: custom_faker.animal.weight(),
    birthDate: faker.date.birthdate(),
    isSterilized: false,
    chipId: custom_faker.animal.chipId(),
    avatar: faker.image.avatar(),
    animalType: animaltype._id,
    breed: breed._id,
    owner: owner._id,
  };
  const animal = await AnimalService.createNew(data);
  const status = "archived";
  const updated = await AnimalService.setStatus(owner, animal._id, status);
  expect(updated.status).toBe(status);
});

test("Check findById: returns animal by id", async () => {
  const data: ArgAnimalModel = {
    name: faker.animal.petName(),
    gender: custom_faker.animal.gender(),
    weight: custom_faker.animal.weight(),
    birthDate: faker.date.birthdate(),
    isSterilized: false,
    chipId: custom_faker.animal.chipId(),
    avatar: faker.image.avatar(),
    animalType: animaltype._id,
    breed: breed._id,
    owner: owner._id,
  };
  const animal = await AnimalService.createNew(data);
  const found = await AnimalService.findById(animal._id);
  expect(found.name).toBe(data.name);
});

test("Check findById: throws error for invalid id", async () => {
  await expect(
    AnimalService.findById(new mongoose.Types.ObjectId())
  ).rejects.toThrow();
});
