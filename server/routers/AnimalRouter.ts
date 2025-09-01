import express from "express";
import { checkAuth } from "../middleware/checkAuth";
import { AnimalService } from "../services/AnimalService";
import { body, param } from "express-validator";
import { validationMiddleware } from "../middleware/validationMiddleware";

const router = express.Router();

router.get(
	// #swagger.tags = ["Animal"]
	// #swagger.security = [{ "bearerAuth": [] }]
	"/",
	checkAuth,
	async (req, res) => {
		const result = await AnimalService.getAll(req.user._id);

		res.json({ animals: result }).status(200);
	},
);
router.get(
	// #swagger.tags = ["Animal"]
	// #swagger.security = [{ "bearerAuth": [] }]
	"/:animal_id",
	param("animal_id").notEmpty().isMongoId(),
	validationMiddleware,
	checkAuth,
	async (req, res) => {
		const { animal_id } = req.params;

		const result = await AnimalService.getOne(req.user._id, animal_id);

		res.json({ animal: result }).status(200);
	},
);
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
	"/",
	body("name").notEmpty().isLength({ min: 3, max: 150 }),
	body("weight").notEmpty().isNumeric(),
	body("breed").notEmpty().isMongoId(),
	body("animalType").notEmpty().isMongoId(),
	body("birthDate").notEmpty().isISO8601().toDate(),
	body("isSterilized").notEmpty().isBoolean(),
	body("avatar").optional({ values: "null" }).isURL(),
	body("gender")
		.notEmpty()
		.custom((inp) => {
			const genders = ["male", "female", "unknown"];
			return genders.includes(inp);
		}),
	body("chipId")
		.optional({ values: "null" })
		.matches(/^\d{15}$/),
	validationMiddleware,
	checkAuth,
	async (req, res) => {
		const animal = { ...req.body, owner: req.user._id };

		const result = await AnimalService.createNew(animal);

		res.json({ animal: result }).status(200);
	},
);
router.put(
	"/:animal_id/sterilized/:value",
	param("animal_id").notEmpty().isMongoId(),
	param("value").notEmpty().isBoolean().toBoolean(),
	validationMiddleware,
	checkAuth,
	async (req, res) => {
		// #swagger.tags = ["Animal"]
		// #swagger.security = [{ "bearerAuth": [] }]

		const { value, animal_id } = req.params;

		const result = await AnimalService.setIsSterilized(
			req.user._id,
			animal_id,
			value,
		);

		res.json({ animal: result }).status(200);
	},
);
router.put(
	"/:animal_id/weight/:value",
	param("animal_id").notEmpty().isMongoId(),
	param("value").notEmpty().isNumeric(),
	validationMiddleware,
	checkAuth,
	async (req, res) => {
		// #swagger.tags = ["Animal"]
		// #swagger.security = [{ "bearerAuth": [] }]

		const { value, animal_id } = req.params;

		const result = await AnimalService.setWeight(req.user._id, animal_id, value);

		res.json({ animal: result }).status(200);
	},
);
router.put(
	"/:animal_id/gender/:value",
	param("animal_id").notEmpty().isMongoId(),
	param("value")
		.notEmpty()
		.custom((inp) => {
			const genders = ["male", "female", "unknown"];
			return genders.includes(inp);
		}),
	validationMiddleware,
	checkAuth,
	async (req, res) => {
		// #swagger.tags = ["Animal"]
		// #swagger.security = [{ "bearerAuth": [] }]

		const { value, animal_id } = req.params;

		const result = await AnimalService.setGender(req.user._id, animal_id, value);

		res.json({ animal: result }).status(200);
	},
);
router.put(
	"/:animal_id/avatar/:value",
	param("animal_id").notEmpty().isMongoId(),
	param("value").notEmpty().isURL(),
	validationMiddleware,
	checkAuth,
	async (req, res) => {
		// #swagger.tags = ["Animal"]
		// #swagger.security = [{ "bearerAuth": [] }]

		const { value, animal_id } = req.params;

		const result = await AnimalService.changeAvatar(
			req.user._id,
			animal_id,
			value,
		);

		res.json({ animal: result }).status(200);
	},
);
router.put(
	"/:animal_id/status/:value",
	param("animal_id").notEmpty().isMongoId(),
	param("value")
		.notEmpty()
		.custom((inp) => {
			const stauses = ["active", "archived"];
			return stauses.includes(inp);
		}),
	validationMiddleware,
	checkAuth,
	async (req, res) => {
		// #swagger.tags = ["Animal"]
		// #swagger.security = [{ "bearerAuth": [] }]

		const { value, animal_id } = req.params;

		const result = await AnimalService.setStatus(req.user._id, animal_id, value);

		res.json({ animal: result }).status(200);
	},
);
router.delete(
	"/:animal_id",
	param("animal_id").notEmpty().isMongoId(),
	validationMiddleware,
	checkAuth,
	async (req, res) => {
		// #swagger.tags = ["Animal"]
		// #swagger.security = [{ "bearerAuth": [] }]

		const { animal_id } = req.params;

		const result = await AnimalService.deleteOne(req.user._id, animal_id);

		res.json({ animal: result }).status(200);
	},
);

export default router;
