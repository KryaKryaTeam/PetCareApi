import type { animal_gender } from "../models/Animal";
import { faker } from "@faker-js/faker";

function makeFixedLength(
  string: string,
  length: number,
  nullChar: string
): string {
  let newStr = string;
  while (newStr.length < length) {
    newStr += nullChar;
  }
  return newStr;
}

export const custom_faker = {
  animal: {
    gender: (): animal_gender => {
      const genders = ["male", "female", "unknown"];
      return genders[
        Math.floor(Math.random() * genders.length)
      ] as animal_gender;
    },
    weight: (): number => {
      return Math.floor(Math.random() * 99) + 1;
    },
    isSterilized: (): boolean => {
      return Math.random() > 0.5;
    },
    chipId: (): string => {
      return makeFixedLength(
        String(Math.floor(Math.random() * 999999999999999)),
        15,
        "0"
      );
    },
  },
  animalType: {
    name: (): string => {
      const types = ["cat", "dog", "bird", "hamster", "rabbit"];
      return types[Math.floor(Math.random() * types.length)];
    },
    icon: (): string => faker.image.avatar(),
  },
  breed: {
    name: (): string => {
      const breeds = ["persian", "siamese", "bulldog", "maine coon", "sphynx"];
      return breeds[Math.floor(Math.random() * breeds.length)];
    },
    recomendation: (): { name: string; description: string } => ({
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
    }),
  },
  user: {
    username: (): string => faker.internet.username(),
    email: (): string => faker.internet.email(),
    avatar: (): string => faker.image.avatar(),
    password: (): string => faker.internet.password(),
  },
};
