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
    res.cookie("refresh", result.refreshToken, {
        domain: process.env.COOKIE_DOMAIN,
        sameSite: "lax",
        httpOnly: true,
        secure: true,
    })
    res.status(200).json({ authorization: result.accessToken })
})

router.post("/register/self", async (req, res, next) => {
    // #swagger.tags = ["Auth"]

    const { username, email, password } = req.body
    const ip = req.ip
    const userAgent = req.headers["user-agent"]

    const result = await AuthServiceSelf.register(username, password, email, userAgent, ip)
    res.cookie("refresh", result.refreshToken, {
        domain: process.env.COOKIE_DOMAIN,
        sameSite: "lax",
        httpOnly: true,
        secure: true,
    })
    res.status(200).json({ authorization: result.accessToken })
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

router.post("/refresh", async (req, res, next) => {
    // #swagger.tags = ["Auth"]
    const { refresh } = req.cookies

    const result = await AuthServiceSelf.refresh(refresh)
    res.cookie("refresh", result.refreshToken, {
        domain: process.env.COOKIE_DOMAIN,
        sameSite: "lax",
        httpOnly: true,
        secure: true,
    })
    res.status(200).json({ authorization: result.accessToken })
})

router.post("/login/google", async (req, res, next) => {
    // #swagger.tags = ["Auth"]
    const { accessToken } = req.body
    const ip = req.ip
    const userAgent = req.headers["user-agent"]

    const result = await AuthServiceSelf.loginUsingGoogle(accessToken, userAgent, ip)

    res.cookie("refresh", result.refreshToken, {
        domain: process.env.COOKIE_DOMAIN,
        sameSite: "lax",
        httpOnly: true,
        secure: true,
    })
    res.status(200).json({ authorization: result.accessToken })
})

router.get("/sesssion/close/:session", checkAuth, async (req, res, next) => {
    // #swagger.tags = ["Auth"]
    // #swagger.security = [{ "bearerAuth": [] }]
    const { session } = req.params
    //@ts-ignore
    const user = req.session.user

    const result = await AuthServiceSelf.closeSession(session, user.toString())

    res.json({ message: "Ok!" }).status(200)
})

router.get("/session/all", checkAuth, async (req, res, next) => {
    // #swagger.tags = ["Auth"]
    // #swagger.security = [{ "bearerAuth": [] }]
    //@ts-ignore
    const user = req.session.user

    const result = await AuthServiceSelf.getAllSessions(user.toString())

    res.json({ sessions: result }).status(200)
})

export default router
