"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashService = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
class HashService {
    static hash(data_to_hash) {
        const hash = node_crypto_1.default.createHash("sha256");
        return hash.update(data_to_hash).digest("hex");
    }
    static check(hashedVal, checkVal) {
        const hashedCheckVal = HashService.hash(checkVal);
        return hashedCheckVal == hashedVal;
    }
}
exports.HashService = HashService;
