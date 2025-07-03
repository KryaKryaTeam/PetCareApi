import express, { Router } from "express"
import AnimalTypeRouter from "./routers/AnimalTypeRouter"
const router: Router = express.Router()

router.get("/ping", (req, res, next) => {
    // #swagger.tags = ["System", "NotSecured"]
    res.json({ message: "pong!" }).status(200)
})

router.use("/animals", AnimalTypeRouter)

export { router }
