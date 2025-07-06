import { describe, it, expect, vi, beforeEach } from "vitest"
import { SessionService } from "../services/auth/SessionService"
import { Types } from "mongoose"

describe("SessionService", () => {
    it("SessionTimestampStringToDate should convert string timestamps to Date objects", () => {
        const session = {
            expiresAt: "2024-06-01T12:00:00.000Z",
            createdAt: "2024-06-01T10:00:00.000Z",
        }
        const result = SessionService.SessionTimestampStringToDate({ ...session })
        expect(result.expiresAt).toBeInstanceOf(Date)
        expect(result.createdAt).toBeInstanceOf(Date)
        expect(result.expiresAt.toISOString()).toBe(session.expiresAt)
        expect(result.createdAt.toISOString()).toBe(session.createdAt)
    })

    it("generateSessionId should generate a unique session id of correct format", () => {
        const id = SessionService.generateSessionId()
        expect(typeof id).toBe("string")
        const [timestamp, header] = id.split("-")
        expect(Number(timestamp)).not.toBeNaN()
        expect(header).toHaveLength(32)
        expect(header).toMatch(/^[a-z0-9]+$/)
    })

    it("generateSessionId should generate different ids on subsequent calls", () => {
        const id1 = SessionService.generateSessionId()
        const id2 = SessionService.generateSessionId()
        expect(id1).not.toBe(id2)
    })

    describe("generateNew", () => {
        const OLD_ENV = process.env

        beforeEach(() => {
            vi.resetModules()
            process.env = { ...OLD_ENV, SESSION_EXP_TIME: "3600000" }
        })

        it("should generate a new session with correct fields", () => {
            const device = "iPhone"
            const ip = "127.0.0.1"
            const provider = "google"
            const objId = new Types.ObjectId()
            const session = SessionService.generateNew(device, ip, provider, objId)

            expect(session).toHaveProperty("sessionId")
            expect(session).toHaveProperty("provider", provider)
            expect(session).toHaveProperty("createdAt")
            expect(session).toHaveProperty("device", device)
            expect(session).toHaveProperty("ip", ip)
            expect(session).toHaveProperty("expiresAt")
            expect(session).toHaveProperty("user", objId)
            expect(session.createdAt).toBeInstanceOf(Date)
            expect(session.expiresAt).toBeInstanceOf(Date)
            expect(session.expiresAt.getTime()).toBeGreaterThan(session.createdAt.getTime())
        })

        it("should set expiresAt according to SESSION_EXP_TIME", () => {
            const now = Date.now()
            vi.spyOn(Date, "now").mockReturnValue(now)
            const session = SessionService.generateNew("device", "ip", "self", new Types.ObjectId())
            expect(session.expiresAt.getTime()).toBe(now + Number(process.env.SESSION_EXP_TIME))
        })
    })
})
