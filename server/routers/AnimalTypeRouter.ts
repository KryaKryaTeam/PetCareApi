import express from "express";
import { AnimalTypeService } from "../services/AnimalTypeService";
import { body, param } from "express-validator";
import { validationMiddleware } from "../middleware/validationMiddleware";
import { checkAuth } from "../middleware/checkAuth";
import { AdminRoleMiddleware } from "../middleware/AdminRoleMiddleware";

const router = express.Router();

router.get("/all", async (_req, res) => {
	// #swagger.tags = ["AnimalType"]

	const animal_types = await AnimalTypeService.getAll();
	res.json({ types: animal_types }).status(200);
});

router.get(
	"/:name",
	param("name").notEmpty(),
	validationMiddleware,
	async (req, res) => {
		// #swagger.tags = ["AnimalType"]

		const { name } = req.params;
		const animal_type = await AnimalTypeService.findByName(name);
		res.json({ animal_type }).status(200);
	},
);

router.post(
	"/create",
	checkAuth,
	AdminRoleMiddleware,
	body("name").notEmpty().isLength({ min: 3, max: 150 }),
	body("icon").isURL(),
	validationMiddleware,
	async (req, res) => {
		// #swagger.tags = ["AnimalType"]
		// #swagger.security = [{ "bearerAuth": [] }]

		const { name, icon } = req.body;

		const animal_type = await AnimalTypeService.createNew(name, icon);
		res.json({ animal_type }).status(200);
	},
);

router.delete(
	"/delete/:name",
	checkAuth,
	AdminRoleMiddleware,
	param("name").notEmpty().isLength({ min: 3, max: 150 }),
	validationMiddleware,
	async (req, res) => {
		// #swagger.tags = ["AnimalType"]
		// #swagger.security = [{ "bearerAuth": [] }]

		const { name } = req.params;

		const num = AnimalTypeService.deleteOne(name);

		res.json({ number: num }).status(200);
	},
);

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

export default router;
