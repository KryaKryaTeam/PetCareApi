"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMiddleware = validationMiddleware;
const express_validator_1 = require("express-validator");
const ApiError_1 = require("../error/ApiError");
async function validationMiddleware(req, res, next) {
    const result = (0, express_validator_1.validationResult)(req);
    console.log(result.array());
    if (!result.isEmpty())
        throw ApiError_1.ApiError.badrequest(result
            .formatWith((error) => error.msg + " " + error?.path)
            .array()
            .join("\n"));
    next();
}
