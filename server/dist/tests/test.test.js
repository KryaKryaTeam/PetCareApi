"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("vitest");
const vitest_1 = require("vitest");
(0, vitest_1.test)("Test test", () => {
    (0, vitest_1.expect)(((num1, num2) => {
        return num1 + num2;
    })(1, 2)).toBe(3);
});
