import path from "path"
import { generateId } from "./id_generateor"
import fs from "fs"
import axios from "axios"
import { isDevMode } from "./isDevMode"

export class Logger {
    endpoint: string
    requestId: string
    startDate: Date
    service: null | string

    constructor(endpoint: string) {
        this.endpoint = endpoint
        this.requestId = generateId("request")
        this.startDate = new Date()
        this.service = null

        globalLogger.set(this)
    }
    start() {
        if (isDevMode()) {
            fs.appendFileSync(
                path.join(__dirname, "..", ".dev", `${this.requestId}.md`),
                `<style>.info-log{color: blue} .error-log{color: red} .debbug-log{color: green}</style> \n# [LOG FILE FOR REQUEST ${this.requestId}]`
            )
        }

        if (!fs.existsSync(path.join(__dirname, "..", "logs"))) fs.mkdirSync(path.join(__dirname, "..", "logs"))
        if (!fs.existsSync(path.join(__dirname, "..", "logs", "requests.log")))
            fs.appendFileSync(path.join(__dirname, "..", "logs", "requests.log"), "")

        this.info("Endpoint: " + this.endpoint)

        console.log(`REQUEST ${this.requestId} IS OPEN`)
    }
    info(message: string) {
        this.writeMessage("[INFO] " + message, "INFO")
    }
    error(message: string) {
        this.writeMessage("[ERROR] " + message, "ERROR")
    }
    debbug(message: string) {
        this.writeMessage("[DEBBUG] " + message, "DEBBUG")
    }

    end() {
        const time = new Date(new Date().getTime() - this.startDate.getTime())
        if (isDevMode()) {
            fs.writeFileSync(
                path.join(__dirname, "..", ".dev", `${this.requestId}.md`),
                `\n ## [REQUEST ENDED. TIME: ${time.getTime()}ms]`,
                { flag: "a" }
            )
        }

        console.log(`\n [REQUEST ENDED. TIME: ${time.getTime()}ms]`)
    }
    writeMessage(message: string, level: "INFO" | "ERROR" | "DEBBUG" | "START" | "END") {
        const class_level = {
            INFO: "info-log",
            ERROR: "error-log",
            DEBBUG: "debbug-log",
        }
        if (isDevMode()) {
            fs.writeFileSync(
                path.join(__dirname, "..", ".dev", `${this.requestId}.md`),
                "\n - <span class='" +
                    class_level[level] +
                    "'>" +
                    new Date().toTimeString() +
                    "   " +
                    message +
                    "</span>",
                { flag: "a" }
            )
        } else {
            fs.writeFileSync(
                path.join(__dirname, "..", "logs", "requests.log"),
                JSON.stringify({
                    level,
                    data: new Date(),
                    message,
                    requestId: this.requestId,
                    endpoint: this.endpoint,
                    service: this.service || "none",
                }) + "\n",
                { flag: "a" }
            )
        }
        console.log("\n -" + new Date().toTimeString() + "   " + message)
    }

    setService(service: string) {
        this.service = service
    }
}

class GlobalLogger {
    private logger_!: Logger

    logger(): Logger {
        return this.logger_
    }

    set(logger: Logger): void {
        this.logger_ = logger
        this.logger_.start()
    }
}

export const globalLogger = new GlobalLogger()
