import express from "express"
import { body, param } from "express-validator"
import { validationMiddleware } from "../middleware/validationMiddleware"
import { AdminRoleMiddleware } from "../middleware/AdminRoleMiddleware"
import { checkAuth } from "../middleware/checkAuth"
import { BreedService } from "../services/BreedService"

const router = express.Router()

router.use(checkAuth, AdminRoleMiddleware)

router.post(
    // #swagger.tags = ["Breed"]
    // #swagger.security = [{ "bearerAuth": [] }]
    "/create",
    body("name").notEmpty().isLength({ min: 3, max: 150 }),
    body("animalType").notEmpty().isMongoId(),
    validationMiddleware,
    async (req, res, next) => {
        const { name, animalType } = req.body

        const result = await BreedService.createNew(name, animalType)

        res.json({ breed: result }).status(200)
    }
)
router.delete(
    // #swagger.tags = ["Breed"]
    // #swagger.security = [{ "bearerAuth": [] }]
    "/delete/:id",
    param("id").notEmpty().isMongoId(),
    validationMiddleware,
    async (req, res, next) => {
        const { id } = req.params

        await BreedService.deleteOne(id)

        res.json({ message: "OK!" }).status(200)
    }
)

router.post(
    // #swagger.tags = ["Breed"]
    // #swagger.security = [{ "bearerAuth": [] }]
    "/rec/create",
    body("breedId").notEmpty().isMongoId(),
    body("recomendation_name").notEmpty().isLength({ min: 3, max: 150 }),
    body("recomendation_content").notEmpty().isLength({ min: 3, max: 1000 }),
    validationMiddleware,
    async (req, res, next) => {
        const { breedId, recomendation_name, recomendation_content } = req.body

        const result = await BreedService.addRecomendationToBreed(breedId, {
            name: recomendation_name,
            content: recomendation_content,
        })

        res.json({ breed: result }).status(200)
    }
)

router.delete(
    // #swagger.tags = ["Breed"]
    // #swagger.security = [{ "bearerAuth": [] }]
    "/rec/delete/:breedId/:name",
    param("breedId").notEmpty().isMongoId(),
    param("name").notEmpty().isLength({ min: 3, max: 150 }),
    validationMiddleware,
    async (req, res, next) => {
        const { name, breedId } = req.params

        const result = await BreedService.deleteRecomendationFromBreed(breedId, name)

        res.json({ breed: result }).status(200)
    }
)

export default router
