"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMiddleware = validationMiddleware;
const express_validator_1 = require("express-validator");
async function validationMiddleware(req, res, next) {
    const result = (0, express_validator_1.validationResult)(req);
    if (!result.isEmpty())
        throw Error("BADREQUEST! " + result.array().map((el) => el.toString()));
    next();
}
