import {
  test,
  expect,
  beforeAll,
  afterAll,
  afterEach,
  beforeEach,
} from "bun:test";
import { AuthServiceSelf } from "../services/auth/AuthService";
import mongoose, { mongo } from "mongoose";
import { faker } from "@faker-js/faker";
import * as jwt from "jsonwebtoken";
import { globalLogger, Logger } from "../utils/logger";
import { config } from "dotenv";
import { ApiError } from "../error/ApiError";
import User from "../models/User";
import { IJWTPayload } from "../services/auth/JWTService";

config();

let db: mongoose.Mongoose;

beforeEach(async () => {
  globalLogger.set(new Logger("/"));
  db = await mongoose.connect(
    "mongodb://admin:password12341234@mongo:27017/pet_tracker?authSource=admin",
    { dbName: "test" }
  );
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

test("Check register function: must be success", async () => {
  const username = faker.internet.username();
  const password = faker.internet.password();
  const email = faker.internet.email();
  const device = faker.internet.userAgent();
  const ip = faker.internet.ipv6();

  const token = await AuthServiceSelf.register(
    username,
    password,
    email,
    device,
    ip
  );

  expect(token).toHaveProperty("accessToken");
  expect(token).toHaveProperty("refreshToken");
  expect(token.accessToken).toBeString();
  expect(token.refreshToken).toBeString();
  expect(token.accessToken).toMatch(
    /[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+/
  );
  expect(token.refreshToken).toMatch(
    /[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+/
  );
  const decode1 = jwt.decode(token.accessToken) as IJWTPayload;
  const decode2 = jwt.decode(token.refreshToken) as IJWTPayload;

  expect(decode1).toHaveProperty("exp");
  expect(decode1).toHaveProperty("familyId");
  expect(decode1).toHaveProperty("session");
  expect(decode1).toHaveProperty(["session", "sessionId"]);
  expect(decode1).toHaveProperty(["session", "familyId"]);
  expect(decode2).toHaveProperty("exp");
  expect(decode2).toHaveProperty("familyId");
  expect(decode2).toHaveProperty("session");
  expect(decode2).toHaveProperty(["session", "familyId"]);
  expect(decode2).toHaveProperty(["session", "sessionId"]);
  expect(decode1.familyId == decode1.session.familyId).toBe(true);
  expect(decode2.familyId == decode2.session.familyId).toBe(true);
  expect(decode1.session).toEqual(decode2.session);
  expect(decode1.familyId == decode2.familyId).toBe(true);
});

test("Check register function: check duplicate", async () => {
  const username = faker.internet.username();
  const password = faker.internet.password();
  const email = faker.internet.email();
  const device = faker.internet.userAgent();
  const ip = faker.internet.ipv6();

  await AuthServiceSelf.register(username, password, email, device, ip);

  expect(
    AuthServiceSelf.register(username, password, email, device, ip)
  ).rejects.toThrowError();
});

test("Check register function: check duplicate only username", async () => {
  const username = faker.internet.username();
  const password = faker.internet.password();
  const email = faker.internet.email();
  const email2 = faker.internet.email();
  const device = faker.internet.userAgent();
  const ip = faker.internet.ipv6();

  await AuthServiceSelf.register(username, password, email, device, ip);
  expect(
    AuthServiceSelf.register(username, password, email2, device, ip)
  ).rejects.toThrowError();
});

test("Check register function: check duplicate only email", async () => {
  const username = faker.internet.username();
  const username2 = faker.internet.username();
  const password = faker.internet.password();
  const email = faker.internet.email();
  const device = faker.internet.userAgent();
  const ip = faker.internet.ipv6();

  await AuthServiceSelf.register(username, password, email, device, ip);
  expect(
    AuthServiceSelf.register(username2, password, email, device, ip)
  ).rejects.toThrowError();
});

test("Check login function: register and after login, must be success", async () => {
  const username = faker.internet.username();
  const password = faker.internet.password();
  const email = faker.internet.email();
  const device = faker.internet.userAgent();
  const ip = faker.internet.ipv6();

  await AuthServiceSelf.register(username, password, email, device, ip);

  const token = await AuthServiceSelf.login(username, password, device, ip);

  expect(token).toHaveProperty("accessToken");
  expect(token).toHaveProperty("refreshToken");
  expect(token.accessToken).toBeString();
  expect(token.refreshToken).toBeString();
  expect(token.accessToken).toMatch(
    /[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+/
  );
  expect(token.refreshToken).toMatch(
    /[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+/
  );
  const decode1 = jwt.decode(token.accessToken) as IJWTPayload;
  const decode2 = jwt.decode(token.refreshToken) as IJWTPayload;

  expect(decode1).toHaveProperty("exp");
  expect(decode1).toHaveProperty("familyId");
  expect(decode1).toHaveProperty("session");
  expect(decode1).toHaveProperty(["session", "sessionId"]);
  expect(decode1).toHaveProperty(["session", "familyId"]);
  expect(decode2).toHaveProperty("exp");
  expect(decode2).toHaveProperty("familyId");
  expect(decode2).toHaveProperty("session");
  expect(decode2).toHaveProperty(["session", "familyId"]);
  expect(decode2).toHaveProperty(["session", "sessionId"]);
  expect(decode1.familyId == decode1.session.familyId).toBe(true);
  expect(decode2.familyId == decode2.session.familyId).toBe(true);
  expect(decode1.session).toEqual(decode2.session);
  expect(decode1.familyId == decode2.familyId).toBe(true);
});

test("Check login function: register and change username, must be failed", async () => {
  const username = faker.internet.username();
  const username2 = faker.internet.username();
  const password = faker.internet.password();
  const email = faker.internet.email();
  const device = faker.internet.userAgent();
  const ip = faker.internet.ipv6();

  await AuthServiceSelf.register(username, password, email, device, ip);

  expect(
    AuthServiceSelf.login(username2, password, device, ip)
  ).rejects.toThrowError();
});

test("Check login function: register and change password, must be failed", async () => {
  const username = faker.internet.username();
  const password = faker.internet.password();
  const password2 = faker.internet.password();
  const email = faker.internet.email();
  const device = faker.internet.userAgent();
  const ip = faker.internet.ipv6();

  await AuthServiceSelf.register(username, password, email, device, ip);

  expect(
    AuthServiceSelf.login(username, password2, device, ip)
  ).rejects.toThrowError();
});

test("Check logout function: register after create two session and after logout, must be success", async () => {
  const username = faker.internet.username();
  const password = faker.internet.password();
  const email = faker.internet.email();
  const device = faker.internet.userAgent();
  const ip = faker.internet.ipv6();
  const device2 = faker.internet.userAgent();
  const ip2 = faker.internet.ipv6();

  await AuthServiceSelf.register(username, password, email, device, ip);
  await AuthServiceSelf.login(username, password, device, ip);
  await AuthServiceSelf.login(username, password, device2, ip2);

  const user = await User.find({ username });
  const sessions = user[0].sessions;

  console.log(sessions);

  expect(sessions).toHaveLength(2);

  await AuthServiceSelf.logout(sessions[0]);

  const user2 = await User.find({ username });
  const sessions2 = user2[0].sessions;

  expect(sessions2).toHaveLength(1);
});

test("Check refresh function: try refresh valid tokens", async () => {
  const username = faker.internet.username();
  const password = faker.internet.password();
  const email = faker.internet.email();
  const device = faker.internet.userAgent();
  const ip = faker.internet.ipv6();

  const tokens = await AuthServiceSelf.register(
    username,
    password,
    email,
    device,
    ip
  );

  const output = await AuthServiceSelf.refresh(tokens.refreshToken);

  expect(output).toBeObject();
  expect(output).toHaveProperty("accessToken");
  expect(output).toHaveProperty("refreshToken");
  expect(output.accessToken).toBeString();
  expect(output.refreshToken).toBeString();
  expect(output.accessToken).toMatch(
    /[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+/
  );
  expect(output.refreshToken).toMatch(
    /[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+/
  );

  const decode1 = jwt.decode(output.accessToken) as IJWTPayload;
  const decode2 = jwt.decode(output.refreshToken) as IJWTPayload;

  expect(decode1).toHaveProperty("exp");
  expect(decode1).toHaveProperty("familyId");
  expect(decode1).toHaveProperty("session");
  expect(decode1).toHaveProperty(["session", "sessionId"]);
  expect(decode1).toHaveProperty(["session", "familyId"]);
  expect(decode2).toHaveProperty("exp");
  expect(decode2).toHaveProperty("familyId");
  expect(decode2).toHaveProperty("session");
  expect(decode2).toHaveProperty(["session", "familyId"]);
  expect(decode2).toHaveProperty(["session", "sessionId"]);
  expect(decode1.familyId == decode1.session.familyId).toBe(true);
  expect(decode2.familyId == decode2.session.familyId).toBe(true);
  expect(decode1.session).toEqual(decode2.session);
  expect(decode1.familyId == decode2.familyId).toBe(true);
});

test("Check refresh function: try refresh unvalid tokens", () => {
  const payload = { familyId: "sdjshdishd", session: {} };

  const token = jwt.sign(payload, "xxxxx");

  expect(AuthServiceSelf.refresh(token)).rejects.toThrow();
});
