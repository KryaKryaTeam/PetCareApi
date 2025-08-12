"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_json_1 = __importDefault(require("./swagger.json"));
const router_1 = require("./router");
const dotenv_1 = require("dotenv");
const ApiError_1 = require("./error/ApiError");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const AttachLogger_1 = require("./middleware/AttachLogger");
require("./types/express/index");
const isDevMode_1 = require("./utils/isDevMode");
(0, dotenv_1.config)();
console.log("|START DATA| - ", "\n   - DEV_MODE:", process.env.DEV_MODE, "\n   - MONGO_URL:", process.env.MONGO_URL, "\n   - SWAGGER_HOST:", process.env.SWAGGER_HOST, "\n   - SWAGGER_SCHEMA:", process.env.SWAGGER_SCHEMA);
if (process.env.DEV_MODE) {
    if (!node_fs_1.default.existsSync(node_path_1.default.join("./.dev"))) {
        node_fs_1.default.mkdirSync(node_path_1.default.join("./.dev"));
    }
}
const app = (0, express_1.default)();
app.use(AttachLogger_1.AttachLogger);
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3001",
        process.env.SWAGGER_SCHEMA + "://" + process.env.SWAGGER_HOST,
        process.env.FRONTEND_URL,
    ],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_json_1.default));
app.use("/api", router_1.router);
app.use((err, req, res, next) => {
    if (err && err.message) {
        if (req.logger)
            req.logger.error(err.message);
        if (err instanceof ApiError_1.ApiError) {
            res.status(err.code).json({ message: err.message });
        }
        else {
            res.status(500).json({
                message: (0, isDevMode_1.isDevMode)() ? err.message : "message is not provided",
            });
        }
    }
});
async function connect() {
    try {
        console.log("TRY TO CONNECT!");
        await mongoose_1.default.connect(process.env.MONGO_URL || "").then(() => {
            console.log("CONNECTED TO DB!");
        });
    }
    catch (err) {
        console.log(err);
        throw "CONNECT TO DB ERROR!";
    }
}
connect();
app.listen(process.env.PORT || 3000, () => {
    console.log("Server run on port ", process.env.PORT || 3000);
});
