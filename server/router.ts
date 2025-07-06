import express, { Router } from "express"
import AuthRouter from "./routers/AuthRouter"
const router: Router = express.Router()

router.get("/ping", (req, res, next) => {
    // #swagger.tags = ["System", "NotSecured"]
    res.json({ message: "pong!" }).status(200)
})

router.use("/user", AuthRouter)

export { router }
