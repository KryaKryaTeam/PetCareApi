import { describe, it, expect, beforeAll, afterAll } from "vitest"
import { JWTService } from "../services/auth/JWTService"
import { ApiError } from "../error/ApiError"
import * as jwt from "jsonwebtoken"
import { IUserSession } from "../models/User"

const OLD_ENV = process.env

describe("JWTService", () => {
    const session: IUserSession = {
        provider: "self",
        createdAt: new Date(),
        sessionId: "sssss",
        device: "device",
        expiresAt: new Date(),
        ip: "0.0.0.0",
    }
    let accessSecret: string
    let refreshSecret: string

    beforeAll(() => {
        process.env = { ...OLD_ENV }
        accessSecret = "test_access_secret"
        refreshSecret = "test_refresh_secret"
        process.env.JWT_SECRET_ACCESS = accessSecret
        process.env.JWT_SECRET_REFRESH = refreshSecret
    })

    afterAll(() => {
        process.env = OLD_ENV
    })

    it("should generate a valid JWT pair", () => {
        const pair = JWTService.generatePair(session)
        expect(pair).toHaveProperty("accessToken")
        expect(pair).toHaveProperty("refreshToken")
        expect(typeof pair.accessToken).toBe("string")
        expect(typeof pair.refreshToken).toBe("string")
    })

    it("should validate access token and return session", () => {
        const pair = JWTService.generatePair(session)
        const decodedSession = JWTService.validateAccess(pair.accessToken)
        expect(decodedSession).toMatchObject(session)
    })

    it("should validate pair and return session", () => {
        const pair = JWTService.generatePair(session)
        const decodedSession = JWTService.validatePair(pair)
        expect(decodedSession).toMatchObject(session)
    })

    it("should throw ApiError.unauthorized if familyId does not match in pair", () => {
        const pair = JWTService.generatePair(session)
        // Tamper refresh token with different familyId
        const payload: any = jwt.verify(pair.refreshToken, refreshSecret)
        payload.familyId = "differentFamilyId"
        const tamperedRefresh = jwt.sign(payload, refreshSecret)
        const tamperedPair = { accessToken: pair.accessToken, refreshToken: tamperedRefresh }
        expect(() => JWTService.validatePair(tamperedPair)).toThrowError(/pair is not accepted/)
    })

    it("should throw if access token is invalid", () => {
        expect(() => JWTService.validateAccess("invalid.token")).toThrow()
    })

    it("should throw if access token is signed with wrong secret", () => {
        const wrongToken = jwt.sign({ session, familyId: "abc" }, "wrong_secret")
        expect(() => JWTService.validateAccess(wrongToken)).toThrow()
    })

    it("should throw if refresh token is invalid in validatePair", () => {
        const pair = JWTService.generatePair(session)
        const tamperedPair = { accessToken: pair.accessToken, refreshToken: "invalid.token" }
        expect(() => JWTService.validatePair(tamperedPair)).toThrow()
    })

    it("should generate unique familyId each time", () => {
        const id1 = JWTService.generateFamilyId()
        const id2 = JWTService.generateFamilyId()
        expect(id1).not.toBe(id2)
        expect(typeof id1).toBe("string")
        expect(id1.length).toBeGreaterThan(32)
        expect(id1.split("-")).toHaveLength(2)
    })
})
