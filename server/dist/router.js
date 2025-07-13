"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const AuthRouter_1 = __importDefault(require("./routers/AuthRouter"));
const ProfileRouter_1 = __importDefault(require("./routers/ProfileRouter"));
const router = express_1.default.Router();
exports.router = router;
router.get("/ping", (req, res, next) => {
    // #swagger.tags = ["System", "NotSecured"]
    res.json({ message: "pong!" }).status(200);
});
router.use("/user", AuthRouter_1.default);
router.use("/profile", ProfileRouter_1.default);
