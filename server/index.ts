import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import swaggerUI from "swagger-ui-express"
import swaggerDoc from "./swagger.json"
import { router } from "./router"
import { config } from "dotenv"

config()

const app = express()
app.use(
    cors({
        origin: "http://localhost:3001",
        credentials: true,
    })
)
app.use(express.json())
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc))
app.use("/api", router)

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
