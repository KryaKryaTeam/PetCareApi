"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalLogger = exports.Logger = void 0;
const path_1 = __importDefault(require("path"));
const id_generateor_1 = require("./id_generateor");
const fs_1 = __importDefault(require("fs"));
const isDevMode_1 = require("./isDevMode");
class Logger {
    constructor(endpoint) {
        this.endpoint = endpoint;
        this.requestId = (0, id_generateor_1.generateId)("request");
        this.startDate = new Date();
        this.service = null;
        exports.globalLogger.set(this);
    }
    start() {
        if ((0, isDevMode_1.isDevMode)()) {
            fs_1.default.appendFileSync(path_1.default.join(__dirname, "..", ".dev", `${this.requestId}.md`), `<style>.info-log{color: blue} .error-log{color: red} .debbug-log{color: green}</style> \n# [LOG FILE FOR REQUEST ${this.requestId}]`);
        }
        if (!fs_1.default.existsSync(path_1.default.join(__dirname, "..", "logs")))
            fs_1.default.mkdirSync(path_1.default.join(__dirname, "..", "logs"));
        if (!fs_1.default.existsSync(path_1.default.join(__dirname, "..", "logs", "requests.log")))
            fs_1.default.appendFileSync(path_1.default.join(__dirname, "..", "logs", "requests.log"), "");
        this.info("Endpoint: " + this.endpoint);
        console.log(`REQUEST ${this.requestId} IS OPEN`);
    }
    info(message) {
        this.writeMessage("[INFO] " + message, "INFO");
    }
    error(message) {
        this.writeMessage("[ERROR] " + message, "ERROR");
    }
    debbug(message) {
        this.writeMessage("[DEBBUG] " + message, "DEBBUG");
    }
    end() {
        const time = new Date(new Date().getTime() - this.startDate.getTime());
        if ((0, isDevMode_1.isDevMode)()) {
            fs_1.default.writeFileSync(path_1.default.join(__dirname, "..", ".dev", `${this.requestId}.md`), `\n ## [REQUEST ENDED. TIME: ${time.getTime()}ms]`, { flag: "a" });
        }
        console.log(`\n [REQUEST ENDED. TIME: ${time.getTime()}ms]`);
    }
    writeMessage(message, level) {
        const class_level = {
            INFO: "info-log",
            ERROR: "error-log",
            DEBBUG: "debbug-log",
        };
        if ((0, isDevMode_1.isDevMode)()) {
            fs_1.default.writeFileSync(path_1.default.join(__dirname, "..", ".dev", `${this.requestId}.md`), "\n - <span class='" +
                class_level[level] +
                "'>" +
                new Date().toTimeString() +
                "   " +
                message +
                "</span>", { flag: "a" });
        }
        fs_1.default.writeFileSync(path_1.default.join(__dirname, "..", "logs", "requests.log"), JSON.stringify({
            level,
            data: new Date(),
            message,
            requestId: this.requestId,
            endpoint: this.endpoint,
            service: this.service || "none",
        }) + "\n", { flag: "a" });
        console.log("\n -" + new Date().toTimeString() + "   " + message);
    }
    setService(service) {
        this.service = service;
    }
}
exports.Logger = Logger;
class GlobalLogger {
    logger() {
        return this.logger_;
    }
    set(logger) {
        this.logger_ = logger;
        this.logger_.start();
    }
}
exports.globalLogger = new GlobalLogger();
