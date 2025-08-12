import "vitest"
import { expect, test } from "vitest"

test("Test test", () => {
    expect(
        ((num1, num2) => {
            return num1 + num2
        })(1, 2)
    ).toBe(3)
})
