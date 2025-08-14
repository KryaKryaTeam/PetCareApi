"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashService = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const logger_1 = require("../../utils/logger");
class HashService {
    static hash(data_to_hash) {
        logger_1.globalLogger.logger().setService("hash_service");
        const hash = node_crypto_1.default.createHash("sha256");
        logger_1.globalLogger.logger().info("Hash is completed");
        return hash.update(data_to_hash).digest("hex");
    }
    static check(hashedVal, checkVal) {
        logger_1.globalLogger.logger().setService("hash_service");
        const hashedCheckVal = HashService.hash(checkVal);
        logger_1.globalLogger.logger().info("Hash check is completed");
        return hashedCheckVal == hashedVal;
    }
}
exports.HashService = HashService;
