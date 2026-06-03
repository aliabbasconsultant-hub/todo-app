import "reflect-metadata"
import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { AppDataSource } from "./data-source"
import { todoRoutes } from "./routes/todo.routes"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
    res.json({ message: "Todo API is running!" })
})

app.use("/api/todos", todoRoutes)

AppDataSource.initialize()
    .then(() => {
        console.log("Database connected successfully!")
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`)
        })
    })
    .catch((error) => {
        console.log("Database connection error:", error)
    })