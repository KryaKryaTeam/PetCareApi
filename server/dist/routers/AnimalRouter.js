"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkAuth_1 = require("../middleware/checkAuth");
const AnimalService_1 = require("../services/AnimalService");
const express_validator_1 = require("express-validator");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const router = express_1.default.Router();
router.get(
// #swagger.tags = ["Animal"]
// #swagger.security = [{ "bearerAuth": [] }]
"/", checkAuth_1.checkAuth, async (req, res, next) => {
    const result = await AnimalService_1.AnimalService.getAll(req.user._id);
    res.json({ animals: result }).status(200);
});
router.get(
// #swagger.tags = ["Animal"]
// #swagger.security = [{ "bearerAuth": [] }]
"/:animal_id", (0, express_validator_1.param)("animal_id").notEmpty().isMongoId(), validationMiddleware_1.validationMiddleware, checkAuth_1.checkAuth, async (req, res, next) => {
    const { animal_id } = req.params;
    const result = await AnimalService_1.AnimalService.getOne(req.user._id, animal_id);
    res.json({ animal: result }).status(200);
});
router.post(
// #swagger.tags = ["Animal"]
// #swagger.security = [{ "bearerAuth": [] }]
/* #swagger.requestBody = {
          required: true,
          content: {
              "application/json": {
                  schema: {
                      $ref: "#/components/schemas/CreateAnimalSchema"
                  }
              }
          }
      }
  */
"/", (0, express_validator_1.body)("name").notEmpty().isLength({ min: 3, max: 150 }), (0, express_validator_1.body)("weight").notEmpty().isNumeric(), (0, express_validator_1.body)("breed").notEmpty().isMongoId(), (0, express_validator_1.body)("animalType").notEmpty().isMongoId(), (0, express_validator_1.body)("birthDate").notEmpty().isISO8601().toDate(), (0, express_validator_1.body)("isSterilized").notEmpty().isBoolean(), (0, express_validator_1.body)("avatar").optional({ values: "null" }).isURL(), (0, express_validator_1.body)("gender")
    .notEmpty()
    .custom((inp, meta) => {
    const genders = ["male", "female", "unknown"];
    return genders.includes(inp);
}), (0, express_validator_1.body)("chipId")
    .optional({ values: "null" })
    .matches(/^\d{15}$/), validationMiddleware_1.validationMiddleware, checkAuth_1.checkAuth, async (req, res, next) => {
    const animal = { ...req.body, owner: req.user._id };
    const result = await AnimalService_1.AnimalService.createNew(animal);
    res.json({ animal: result }).status(200);
});
router.put("/:animal_id/sterilized/:value", (0, express_validator_1.param)("animal_id").notEmpty().isMongoId(), (0, express_validator_1.param)("value").notEmpty().isBoolean().toBoolean(), validationMiddleware_1.validationMiddleware, checkAuth_1.checkAuth, async (req, res, next) => {
    // #swagger.tags = ["Animal"]
    // #swagger.security = [{ "bearerAuth": [] }]
    const { value, animal_id } = req.params;
    const result = await AnimalService_1.AnimalService.setIsSterilized(req.user._id, animal_id, value);
    res.json({ animal: result }).status(200);
});
router.put("/:animal_id/weight/:value", (0, express_validator_1.param)("animal_id").notEmpty().isMongoId(), (0, express_validator_1.param)("value").notEmpty().isNumeric(), validationMiddleware_1.validationMiddleware, checkAuth_1.checkAuth, async (req, res, next) => {
    // #swagger.tags = ["Animal"]
    // #swagger.security = [{ "bearerAuth": [] }]
    const { value, animal_id } = req.params;
    const result = await AnimalService_1.AnimalService.setWeight(req.user._id, animal_id, value);
    res.json({ animal: result }).status(200);
});
router.put("/:animal_id/gender/:value", (0, express_validator_1.param)("animal_id").notEmpty().isMongoId(), (0, express_validator_1.param)("value")
    .notEmpty()
    .custom((inp, meta) => {
    const genders = ["male", "female", "unknown"];
    return genders.includes(inp);
}), validationMiddleware_1.validationMiddleware, checkAuth_1.checkAuth, async (req, res, next) => {
    // #swagger.tags = ["Animal"]
    // #swagger.security = [{ "bearerAuth": [] }]
    const { value, animal_id } = req.params;
    const result = await AnimalService_1.AnimalService.setGender(req.user._id, animal_id, value);
    res.json({ animal: result }).status(200);
});
router.put("/:animal_id/avatar/:value", (0, express_validator_1.param)("animal_id").notEmpty().isMongoId(), (0, express_validator_1.param)("value").notEmpty().isURL(), validationMiddleware_1.validationMiddleware, checkAuth_1.checkAuth, async (req, res, next) => {
    // #swagger.tags = ["Animal"]
    // #swagger.security = [{ "bearerAuth": [] }]
    const { value, animal_id } = req.params;
    const result = await AnimalService_1.AnimalService.changeAvatar(req.user._id, animal_id, value);
    res.json({ animal: result }).status(200);
});
router.put("/:animal_id/status/:value", (0, express_validator_1.param)("animal_id").notEmpty().isMongoId(), (0, express_validator_1.param)("value")
    .notEmpty()
    .custom((inp, meta) => {
    const stauses = ["active", "archived"];
    return stauses.includes(inp);
}), validationMiddleware_1.validationMiddleware, checkAuth_1.checkAuth, async (req, res, next) => {
    // #swagger.tags = ["Animal"]
    // #swagger.security = [{ "bearerAuth": [] }]
    const { value, animal_id } = req.params;
    const result = await AnimalService_1.AnimalService.setStatus(req.user._id, animal_id, value);
    res.json({ animal: result }).status(200);
});
router.delete("/:animal_id", (0, express_validator_1.param)("animal_id").notEmpty().isMongoId(), validationMiddleware_1.validationMiddleware, checkAuth_1.checkAuth, async (req, res, next) => {
    // #swagger.tags = ["Animal"]
    // #swagger.security = [{ "bearerAuth": [] }]
    const { animal_id } = req.params;
    const result = await AnimalService_1.AnimalService.deleteOne(req.user._id, animal_id);
    res.json({ animal: result }).status(200);
});
exports.default = router;
