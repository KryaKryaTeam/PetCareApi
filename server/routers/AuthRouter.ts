import express, { Router } from "express"
import { AuthServiceSelf } from "../services/auth/AuthService"
import { ApiError } from "../error/ApiError"
import { checkAuth } from "../middleware/checkAuth"
const router: Router = express.Router()

router.post("/login/self", async (req, res, next) => {
    // #swagger.tags = ["Auth"]

    const { username, password } = req.body
    const ip = req.ip
    const userAgent = req.headers["user-agent"]

    const result = await AuthServiceSelf.login(username, password, userAgent, ip)
    res.status(200).json({ authorization: result })
})

router.post("/register/self", async (req, res, next) => {
    // #swagger.tags = ["Auth"]

    const { username, email, password } = req.body
    const ip = req.ip
    const userAgent = req.headers["user-agent"]

    const result = await AuthServiceSelf.register(username, password, email, userAgent, ip)
    res.status(200).json({ authorization: result })
})

router.get("/logout", checkAuth, async (req, res, next) => {
    // #swagger.tags = ["Auth"]
    // #swagger.security = [{ "bearerAuth": [] }]
    //@ts-ignore
    await AuthServiceSelf.logout(req.session)
    res.status(200).json({ message: "Success!" })
})

router.get("/check", checkAuth, (req, res, next) => {
    // #swagger.tags = ["Auth"]
    // #swagger.security = [{ "bearerAuth": [] }]
    res.status(200).json({ message: "OK!" })
})

export default router
