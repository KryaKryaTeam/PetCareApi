import express from "express"
import { checkAuth } from "../middleware/checkAuth"
import { ProfileService } from "../services/ProfileService"
import { body } from "express-validator"
import { validationMiddleware } from "../middleware/validationMiddleware"
const router = express.Router()

router.get("/", checkAuth, async (req, res, next) => {
    // #swagger.tags = ["Profile"]
    // #swagger.security = [{ "bearerAuth": [] }]
    //@ts-ignore
    const session = req.session

    const result = await ProfileService.getProfile(session.user.toString())

    res.json({ profile: result }).status(200)
})
router.post(
    "/avatar/url",
    body("avatar").notEmpty().isURL(),
    validationMiddleware,
    checkAuth,
    async (req, res, next) => {
        // #swagger.tags = ["Profile"]
        // #swagger.security = [{ "bearerAuth": [] }]
        //@ts-ignore
        const session = req.session
        const { avatar } = req.body

        const result = await ProfileService.changeAvatar(avatar, session.user.toString())

        res.json({ message: "OK!" }).status(200)
    }
)

export default router
