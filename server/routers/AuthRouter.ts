import express from "express"
import { AuthServiceSelf } from "../services/auth/AuthService"
import { ApiError } from "../error/ApiError"
import { checkAuth } from "../middleware/checkAuth"
import { body, cookie, param } from "express-validator"
import { validationMiddleware } from "../middleware/validationMiddleware"
const router = express.Router()

router.post(
    // #swagger.tags = ["Auth"]
    /* #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/SelfLoginSchema"
                    }
                }
            }
        } 
    */
    "/login/self",
    body("username").notEmpty().isLength({ min: 3, max: 100 }),
    body("password")
        .notEmpty()
        .isLength({ min: 8, max: 100 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/),
    validationMiddleware,
    async (req, res, next) => {
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
    }
)

router.post(
    // #swagger.tags = ["Auth"]
    /* #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/SelfRegisterSchema"
                    }
                }
            }
        } 
    */
    "/register/self",
    body("username").notEmpty().isLength({ min: 3, max: 100 }),
    body("password")
        .notEmpty()
        .isLength({ min: 8, max: 100 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/),
    body("email").notEmpty().isEmail(),
    validationMiddleware,
    async (req, res, next) => {
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
    }
)

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

router.post("/refresh", cookie("refresh").notEmpty().isJWT(), validationMiddleware, async (req, res, next) => {
    // #swagger.tags = ["Auth"]
    // #swagger.security = [{ "bearerAuth": [] }]
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

router.post(
    // #swagger.tags = ["Auth"]
    "/login/google",
    body("accessToken").notEmpty(),
    validationMiddleware,
    async (req, res, next) => {
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
    }
)

router.get(
    // #swagger.tags = ["Auth"]
    // #swagger.security = [{ "bearerAuth": [] }]
    "/sesssion/close/:session",
    param("session")
        .notEmpty()
        .matches(/^\d+[-]\w{32}/),
    validationMiddleware,
    checkAuth,
    async (req, res, next) => {
        const { session } = req.params
        //@ts-ignore
        const user = req.session.user

        const result = await AuthServiceSelf.closeSession(session, user.toString())

        res.json({ message: "Ok!" }).status(200)
    }
)

router.get("/session/all", checkAuth, async (req, res, next) => {
    // #swagger.tags = ["Auth"]
    // #swagger.security = [{ "bearerAuth": [] }]
    //@ts-ignore
    const user = req.session.user

    const result = await AuthServiceSelf.getAllSessions(user.toString())

    res.json({ sessions: result }).status(200)
})

export default router
