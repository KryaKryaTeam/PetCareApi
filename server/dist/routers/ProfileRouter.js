"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../middleware/checkAuth");
const ProfileService_1 = require("../services/ProfileService");
const express_validator_1 = require("express-validator");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const router = express_1.default.Router();
router.get("/", checkAuth_1.checkAuth, async (req, res, next) => {
    // #swagger.tags = ["Profile"]
    // #swagger.security = [{ "bearerAuth": [] }]
    const session = req.session;
    const result = await ProfileService_1.ProfileService.getProfile(session.user.toString());
    res.json({ profile: result }).status(200);
});
router.post("/avatar/url", (0, express_validator_1.body)("avatar").notEmpty().isURL(), validationMiddleware_1.validationMiddleware, checkAuth_1.checkAuth, async (req, res, next) => {
    // #swagger.tags = ["Profile"]
    // #swagger.security = [{ "bearerAuth": [] }]
    const session = req.session;
    const { avatar } = req.body;
    const result = await ProfileService_1.ProfileService.changeAvatar(avatar, session.user.toString());
    res.json({ message: "OK!" }).status(200);
});
exports.default = router;
