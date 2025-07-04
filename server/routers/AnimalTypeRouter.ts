import express, { Router } from "express"
import { AnimalTypeService } from "../services/AnimalTypeService"
//@ts-expect-error
import { param, body } from "express-validator"
import { validationMiddleware } from "../middleware/validationMiddleware"
const router: Router = express.Router()

router.get(
    "/breed/:animalTypeName",
    param("animalTypeName").isLength({ min: 1, max: 150 }).notEmpty(),
    validationMiddleware,
    async (req, res, next) => {
        // #swagger.tags = ["AnimalType", "NotSecured"]
        const { animalTypeName } = req.params

        const data = await AnimalTypeService.getBreedsByName(animalTypeName)

        res.json({ breeds: data }).status(200)
    }
)
router.get("/", async (req, res, next) => {
    // #swagger.tags = ["AnimalType", "NotSecured"]
    const res_ = await AnimalTypeService.getAllAnimalTypes()

    res.json({ types: res_ }).status(200)
})
router.post(
    "/breed",
    body("name").isLength({ min: 1, max: 150 }).notEmpty(),
    body("icon").notEmpty(),
    body("breeds").notEmpty().isArray(),
    validationMiddleware,
    async (req, res, next) => {
        // #swagger.tags = ["AnimalType", "Secured"]
        const { name, icon, breeds } = req.body

        const data = await AnimalTypeService.createAnimalType({ name, icon, breeds })

        res.json({ animalType: data }).status(200)
    }
)
router.post(
    "/breed/:animalTypeName",
    param("animalTypeName").isLength({ min: 1, max: 150 }).notEmpty(),
    body("breeds").notEmpty().isArray(),
    validationMiddleware,
    async (req, res, next) => {
        // #swagger.tags = ["AnimalType", "Secured"]
        const { breeds } = req.body
        const { animalTypeName } = req.params

        const data = await AnimalTypeService.changeAnimalBreeds(animalTypeName, breeds)

        res.json({ animalType: data }).status(200)
    }
)
router.delete(
    "/:animalTypeName",
    param("animalTypeName").notEmpty().isLength({ min: 1, max: 150 }),
    validationMiddleware,
    async (req, res, next) => {
        // #swagger.tags = ["AnimalType", "Secured"]
        const { animalTypeName } = req.params

        const res_ = await AnimalTypeService.deleteAnimalType(animalTypeName)
        if (res_ == 0) {
            res.status(404).json({ message: "Undefined!" })
            return
        }
        res.json({ message: "Deleted!" }).status(200)
    }
)

export default router
