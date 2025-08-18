"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const AdminRoleMiddleware_1 = require("../middleware/AdminRoleMiddleware");
const checkAuth_1 = require("../middleware/checkAuth");
const BreedService_1 = require("../services/BreedService");
const router = express_1.default.Router();
router.use(checkAuth_1.checkAuth, AdminRoleMiddleware_1.AdminRoleMiddleware);
router.post(
// #swagger.tags = ["Breed"]
// #swagger.security = [{ "bearerAuth": [] }]
"/create", (0, express_validator_1.body)("name").notEmpty().isLength({ min: 3, max: 150 }), (0, express_validator_1.body)("animalType").notEmpty().isLength({ min: 3, max: 150 }), validationMiddleware_1.validationMiddleware, async (req, res, next) => {
    const { name, animalType } = req.body;
    const result = await BreedService_1.BreedService.createNew(name, animalType);
    res.json({ breed: result }).status(200);
});
router.delete(
// #swagger.tags = ["Breed"]
// #swagger.security = [{ "bearerAuth": [] }]
"/delete/:id", (0, express_validator_1.param)("id").notEmpty().isMongoId(), validationMiddleware_1.validationMiddleware, async (req, res, next) => {
    const { id } = req.params;
    await BreedService_1.BreedService.deleteOne(id);
    res.json({ message: "OK!" }).status(200);
});
router.post(
// #swagger.tags = ["Breed"]
// #swagger.security = [{ "bearerAuth": [] }]
"/rec/create", (0, express_validator_1.body)("breedId").notEmpty().isMongoId(), (0, express_validator_1.body)("recomendation_name").notEmpty().isLength({ min: 3, max: 150 }), (0, express_validator_1.body)("recomendation_content").notEmpty().isLength({ min: 3, max: 1000 }), validationMiddleware_1.validationMiddleware, async (req, res, next) => {
    const { breedId, recomendation_name, recomendation_content } = req.body;
    const result = await BreedService_1.BreedService.addRecomendationToBreed(breedId, {
        name: recomendation_name,
        content: recomendation_content,
    });
    res.json({ breed: result }).status(200);
});
router.delete(
// #swagger.tags = ["Breed"]
// #swagger.security = [{ "bearerAuth": [] }]
"/rec/delete/:breedId/:name", (0, express_validator_1.param)("breedId").notEmpty().isMongoId(), (0, express_validator_1.param)("name").notEmpty().isLength({ min: 3, max: 150 }), validationMiddleware_1.validationMiddleware, async (req, res, next) => {
    const { name, breedId } = req.params;
    const result = await BreedService_1.BreedService.deleteRecomendationFromBreed(breedId, name);
    res.json({ breed: result }).status(200);
});
exports.default = router;
