import { afterAll, beforeAll, expect, test } from "vitest"
import { AnimalTypeService } from "../services/AnimalTypeService"
import mongoose from "mongoose"
import { config } from "dotenv"

beforeAll(async () => {
    config()
    if (!process.env.MONGO_URL) throw new Error("Missing MONGO_URL")
    await mongoose.connect(process.env.MONGO_URL, { dbName: "test" })
})

afterAll(async () => {
    await mongoose.connection.db.dropDatabase()
    await mongoose.disconnect()
})

test("check create animal type in service", async () => {
    const result = await AnimalTypeService.createAnimalType({
        name: "animal",
        breeds: ["breed1", "breed2", "breed3"],
        icon: "%backend%/images/animal.png",
    })
    expect(result).toHaveProperty("name", "animal")
    expect(result).toHaveProperty("breeds")
    expect(result.breeds).toHaveLength(3)
    expect(result).toHaveProperty("icon", "%backend%/images/animal.png")
})

test("fails on invalid input", async () => {
    await expect(AnimalTypeService.createAnimalType({ name: "", icon: "", breeds: [] })).rejects.toThrow()
})

test("check animal type get breeds in service (defined)", async () => {
    const result = await AnimalTypeService.getBreedsByName("animal")
    expect(result).toHaveLength(3)
})

test("check animal type get breeds in service (undefined)", async () => {
    const result = await AnimalTypeService.getBreedsByName("animal2")
    expect(result).toHaveLength(0)
})

test("check animal type breeds change", async () => {
    const result1 = await AnimalTypeService.changeAnimalBreeds("animal", ["breedtest1"])
    const result2 = await AnimalTypeService.getBreedsByName("animal")
    expect(result2).toHaveLength(1)
    expect(result2[0]).toBe("breedtest1")
})

test("check animal type delete (defined)", async () => {
    const result1 = await AnimalTypeService.deleteAnimalType("animal")
    expect(result1).toBe(1)
})

test("check animal type delete (undefined)", async () => {
    const result1 = await AnimalTypeService.deleteAnimalType("animal")
    expect(result1).toBe(0)
})

test("check get all animal types", async () => {
    const animal1 = await AnimalTypeService.createAnimalType({ name: "animal1", icon: "icon1", breeds: ["breed1"] })
    const animal2 = await AnimalTypeService.createAnimalType({ name: "animal2", icon: "icon2", breeds: ["breed2"] })
    const result1 = await AnimalTypeService.getAllAnimalTypes()
    expect(result1).toHaveLength(2)
    expect(result1[0]).toHaveProperty("name", animal1.name)
    expect(result1[1]).toHaveProperty("name", animal2.name)
})
