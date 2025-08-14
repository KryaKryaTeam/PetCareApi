"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDevMode = isDevMode;
function isDevMode() {
    return process.env.DEV_MODE == "true";
}
