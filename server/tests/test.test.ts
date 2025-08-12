import "vitest"
import { expect, test } from "vitest"

test("Hello", () => {
    expect(
        ((num1, num2) => {
            return num1 + num2
        })(1, 2)
    ).toBe(3)
})
