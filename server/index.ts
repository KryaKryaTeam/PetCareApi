import express from "express"
import cors from "cors"
import mongoose from "mongoose"

const app = express()
app.use(
    cors({
        origin: "http://localhost:3001/",
        credentials: true,
    })
)

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
