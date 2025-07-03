import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import swaggerUI from "swagger-ui-express"
import swaggerDoc from "./swagger.json"
import { router } from "./router"

const app = express()
app.use(
    cors({
        origin: "http://localhost:3001/",
        credentials: true,
    })
)
app.use(express.json())
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDoc))
app.use("/api", router)

async function connect() {
    try {
        console.log("TRY TO CONNECT!")
        await mongoose.connect("mongodb://admin:password12341234@mongo:27017/mydatabase?authSource=admin").then(() => {
            console.log("CONNECTED TO DB!")
        })
    } catch (err) {
        console.log(err)
        throw "CONNECT TO DB ERROR!"
    }
}

connect()

app.listen(3000, () => {
    console.log("Server run on port 3000")
})
