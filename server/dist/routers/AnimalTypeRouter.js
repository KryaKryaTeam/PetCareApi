"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AnimalTypeService_1 = require("../services/AnimalTypeService");
const express_validator_1 = require("express-validator");
const validationMiddleware_1 = require("../middleware/validationMiddleware");
const checkAuth_1 = require("../middleware/checkAuth");
const AdminRoleMiddleware_1 = require("../middleware/AdminRoleMiddleware");
const router = express_1.default.Router();
router.get("/all", async (req, res, next) => {
    // #swagger.tags = ["AnimalType"]
    const animal_types = await AnimalTypeService_1.AnimalTypeService.getAll();
    res.json({ types: animal_types }).status(200);
});
router.get("/:name", (0, express_validator_1.param)("name").notEmpty(), validationMiddleware_1.validationMiddleware, async (req, res, next) => {
    // #swagger.tags = ["AnimalType"]
    const { name } = req.params;
    const animal_type = await AnimalTypeService_1.AnimalTypeService.findByName(name);
    res.json({ animal_type }).status(200);
});
router.post("/create", checkAuth_1.checkAuth, AdminRoleMiddleware_1.AdminRoleMiddleware, (0, express_validator_1.body)("name").notEmpty().isLength({ min: 3, max: 150 }), (0, express_validator_1.body)("icon").isURL(), validationMiddleware_1.validationMiddleware, async (req, res, next) => {
    // #swagger.tags = ["AnimalType"]
    // #swagger.security = [{ "bearerAuth": [] }]
    const { name, icon } = req.body;
    const animal_type = await AnimalTypeService_1.AnimalTypeService.createNew(name, icon);
    res.json({ animal_type }).status(200);
});
router.delete("/delete/:name", checkAuth_1.checkAuth, AdminRoleMiddleware_1.AdminRoleMiddleware, (0, express_validator_1.param)("name").notEmpty().isLength({ min: 3, max: 150 }), validationMiddleware_1.validationMiddleware, async (req, res, next) => {
    // #swagger.tags = ["AnimalType"]
    // #swagger.security = [{ "bearerAuth": [] }]
    const { name } = req.params;
    const num = AnimalTypeService_1.AnimalTypeService.deleteOne(name);
    res.json({ number: num }).status(200);
});
// router.post(
//   "/breeds/:name",
//   param("name").notEmpty().isLength({ min: 3, max: 150 }),
//   body("breed").notEmpty().isMongoId(),
//   validationMiddleware,
//   async (req, res, next) => {
//     const { name } = req.params;
//     const { breed } = req.body;
//     const animal_type = await AnimalTypeService.addBreedToAnimalType(
//       name,
//       breed
//     );
//     res.json({ animal_type }).status(200);
//   }
// );
// router.delete(
//   "/breeds/:name/",
//   param("name").notEmpty().isLength({ min: 3, max: 150 }),
//   body("breed").notEmpty().isMongoId(),
//   validationMiddleware,
//   async (req, res, next) => {
//     const { name } = req.params;
//     const { breed } = req.body;
//     const animal_type = await AnimalTypeService.deleteBreedFromAnimalType(
//       name,
//       breed
//     );
//     res.json({ animal_type }).status(200);
//   }
// );
exports.default = router;
