"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttachLogger = AttachLogger;
const logger_1 = require("../utils/logger");
function AttachLogger(req, res, next) {
    req.logger = new logger_1.Logger(req.path);
    const old_ = res.json;
    res.json = new Proxy(old_, {
        apply(target, thisArg, argArray) {
            req.logger.end();
            return target.apply(thisArg, argArray);
        },
    });
    next();
}
