import path from "path";
import { generateId } from "./id_generateor";
import fs from "fs";

export class Logger {
  endpoint: string;
  requestId: string;
  startDate: Date;
  constructor(endpoint: string) {
    this.endpoint = endpoint;
    this.requestId = generateId("request");
    this.startDate = new Date();

    if (process.env.DEV_MODE) {
      fs.appendFileSync(
        path.join(__dirname, "..", ".dev", `${this.requestId}.md`),
        `<style>.info-log{color: blue} .error-log{color: red} .debbug-log{color: green}</style> \n# [LOG FILE FOR REQUEST ${this.requestId}]`
      );
    }

    this.info("Endpoint: " + endpoint);

    console.log(`REQUEST ${this.requestId} IS OPEN`);

    globalLogger.set(this);
  }
  info(message: string) {
    this.writeMessage("[INFO] " + message, "info-log");
  }
  error(message: string) {
    this.writeMessage("[ERROR] " + message, "error-log");
  }
  debbug(message: string) {
    this.writeMessage("[DEBBUG] " + message, "debbug-log");
  }
  end() {
    const time = new Date(new Date().getTime() - this.startDate.getTime());
    if (process.env.DEV_MODE) {
      fs.writeFileSync(
        path.join(__dirname, "..", ".dev", `${this.requestId}.md`),
        `\n ## [REQUEST ENDED. TIME: ${time.getTime()}ms]`,
        { flag: "a" }
      );
    }
    console.log(`\n [REQUEST ENDED. TIME: ${time.getTime()}ms]`);
  }
  writeMessage(message: string, class_?: string) {
    if (process.env.DEV_MODE) {
      fs.writeFileSync(
        path.join(__dirname, "..", ".dev", `${this.requestId}.md`),
        "\n - <span class='" +
          class_ +
          "'>" +
          new Date().toTimeString() +
          "   " +
          message +
          "</span>",
        { flag: "a" }
      );
    }
    console.log("\n -" + new Date().toTimeString() + "   " + message);
  }
}

class GlobalLogger {
  private logger_!: Logger;
  constructor() {}
  logger(): Logger {
    return this.logger_;
  }

  set(logger: Logger): void {
    this.logger_ = logger;
  }
}

export const globalLogger = new GlobalLogger();
