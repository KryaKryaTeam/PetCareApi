import { test, expect, describe } from "vitest"
import { HashService } from "../services/auth/HashService"

describe("HashService", () => {
    test("hash should return a 64-character hex string for sha256", () => {
        const data = "mySecret"
        const hash = HashService.hash(data)
        expect(hash).toMatch(/^[a-f0-9]{64}$/)
    })

    test("hash should produce the same output for the same input", () => {
        const data = "repeatable"
        const hash1 = HashService.hash(data)
        const hash2 = HashService.hash(data)
        expect(hash1).toBe(hash2)
    })

    test("hash should produce different outputs for different inputs", () => {
        const hash1 = HashService.hash("input1")
        const hash2 = HashService.hash("input2")
        expect(hash1).not.toBe(hash2)
    })

    test("check should return true for matching hash and value", () => {
        const value = "password123"
        const hash = HashService.hash(value)
        expect(HashService.check(hash, value)).toBe(true)
    })

    test("check should return false for non-matching hash and value", () => {
        const hash = HashService.hash("password123")
        expect(HashService.check(hash, "wrongpassword")).toBe(false)
    })
})
