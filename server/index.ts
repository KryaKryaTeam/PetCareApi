import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import swaggerUI from "swagger-ui-express"
import swaggerDoc from "./swagger.json"
import { router } from "./router"
import { config } from "dotenv"
import { ApiError } from "./error/ApiError"
import cookieParser from "cookie-parser"

config()

console.log(
    "|START DATA| - ",
    "\n   - DEV_MODE:",
    process.env.DEV_MODE,
    "\n   - MONGO_URL:",
    process.env.MONGO_URL,
    "\n   - SWAGGER_HOST:",
    process.env.SWAGGER_HOST,
    "\n   - SWAGGER_SCHEMA:",
    process.env.SWAGGER_SCHEMA
)

const app = express()

app.use(
    cors({
        origin: [
            "http://localhost:3001",
            process.env.SWAGGER_SCHEMA + "://" + process.env.SWAGGER_HOST,
            process.env.FRONTEND_URL,
        ],
        credentials: true,
    })
)
app.use(cookieParser())
app.use(express.json())
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc))
app.use("/api", router)
app.use((err, req, res, next) => {
    console.log(new Date().toISOString() + " |ERROR| - " + err.message)
    if (err instanceof ApiError) {
        res.status(err.code).json({ message: err.message })
    } else {
        res.status(500).json({ message: Boolean(process.env.DEV_MODE) ? err.message : "message is not provided" })
    }
})

async function connect() {
    try {
        console.log("TRY TO CONNECT!")
        await mongoose.connect(process.env.MONGO_URL || "").then(() => {
            console.log("CONNECTED TO DB!")
        })
    } catch (err) {
        console.log(err)
        throw "CONNECT TO DB ERROR!"
    }
}

connect()

app.listen(process.env.PORT || 3000, () => {
    console.log("Server run on port ", process.env.PORT || 3000)
})
