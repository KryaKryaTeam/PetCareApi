import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import swaggerUI from "swagger-ui-express";
import swaggerDoc from "./swagger.json";
import { router } from "./router";
import { config } from "dotenv";
import { ApiError } from "./error/ApiError";
import cookieParser from "cookie-parser";
import fs from "node:fs";
import path from "node:path";
import { AttachLogger } from "./middleware/AttachLogger";
// import "./types/express/index";
import { isDevMode } from "./utils/isDevMode";
import { master_provider } from "./services/auth/providers/Provider";
import { SelfProvider } from "./services/auth/providers/SelfProvider";

config();

console.log(
	"|START DATA| - ",
	"\n   - DEV_MODE:",
	process.env.DEV_MODE,
	"\n   - MONGO_URL:",
	process.env.MONGO_URL,
	"\n   - SWAGGER_HOST:",
	process.env.SWAGGER_HOST,
	"\n   - SWAGGER_SCHEMA:",
	process.env.SWAGGER_SCHEMA,
	"\n   - MAILGUN_KEY:",
	process.env.MAILGUN_KEY,
	"\n   - MAILGUN_DOMAIN:",
	process.env.MAILGUN_DOMAIN,
);

if (process.env.DEV_MODE) {
	if (!fs.existsSync(path.join("./.dev"))) {
		fs.mkdirSync(path.join("./.dev"));
	}
}

const app = express();

app.use(AttachLogger);
app.use(
	cors({
		origin: [
			"http://localhost:3001",
			process.env.SWAGGER_SCHEMA + "://" + process.env.SWAGGER_HOST,
			process.env.FRONTEND_URL,
		],
		credentials: true,
	}),
);
app.use(cookieParser());
app.use(express.json());
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc));
app.use("/api", router);
app.use((err, req, res, _next) => {
	if (err && err.message) {
		if (req.logger) req.logger.error(err.message);
		if (err instanceof ApiError) {
			res.status(err.code).json({ message: err.message });
		} else {
			res.status(500).json({
				message: isDevMode() ? err.message : "message is not provided",
			});
		}
	}
});

async function connect() {
	try {
		console.log("TRY TO CONNECT!");
		await mongoose
			.connect(process.env.MONGO_URL || "", { dbName: "main", autoIndex: true })
			.then(() => {
				console.log("CONNECTED TO DB!");
			});
	} catch (err) {
		console.log(err);
		throw "CONNECT TO DB ERROR!";
	}
}

connect();

master_provider.addProvider(new SelfProvider(), "self");
master_provider.addProvider(new SelfProvider(), "self2");

app.listen(process.env.PORT || 3000, () => {
	console.log("Server run on port ", process.env.PORT || 3000);
});
