"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalLogger = exports.Logger = void 0;
const path_1 = __importDefault(require("path"));
const id_generateor_1 = require("./id_generateor");
const fs_1 = __importDefault(require("fs"));
class Logger {
    constructor(endpoint) {
        this.endpoint = endpoint;
        this.requestId = (0, id_generateor_1.generateId)("request");
        this.startDate = new Date();
        if (process.env.DEV_MODE) {
            fs_1.default.appendFileSync(path_1.default.join(__dirname, "..", ".dev", `${this.requestId}.md`), `<style>.info-log{color: blue} .error-log{color: red} .debbug-log{color: green}</style> \n# [LOG FILE FOR REQUEST ${this.requestId}]`);
        }
        this.info("Endpoint: " + endpoint);
        console.log(`REQUEST ${this.requestId} IS OPEN`);
        exports.globalLogger.set(this);
    }
    info(message) {
        this.writeMessage("[INFO] " + message, "info-log");
    }
    error(message) {
        this.writeMessage("[ERROR] " + message, "error-log");
    }
    debbug(message) {
        this.writeMessage("[DEBBUG] " + message, "debbug-log");
    }
    end() {
        const time = new Date(new Date().getTime() - this.startDate.getTime());
        if (process.env.DEV_MODE) {
            fs_1.default.writeFileSync(path_1.default.join(__dirname, "..", ".dev", `${this.requestId}.md`), `\n ## [REQUEST ENDED. TIME: ${time.getTime()}ms]`, { flag: "a" });
        }
        console.log(`\n [REQUEST ENDED. TIME: ${time.getTime()}ms]`);
    }
    writeMessage(message, class_) {
        if (process.env.DEV_MODE) {
            fs_1.default.writeFileSync(path_1.default.join(__dirname, "..", ".dev", `${this.requestId}.md`), "\n - <span class='" +
                class_ +
                "'>" +
                new Date().toTimeString() +
                "   " +
                message +
                "</span>", { flag: "a" });
        }
        console.log("\n -" + new Date().toTimeString() + "   " + message);
    }
}
exports.Logger = Logger;
class GlobalLogger {
    constructor() { }
    logger() {
        return this.logger_;
    }
    set(logger) {
        this.logger_ = logger;
    }
}
exports.globalLogger = new GlobalLogger();
