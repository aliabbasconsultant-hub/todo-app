import { Router } from "express"
import { AppDataSource } from "../data-source"
import { Todo } from "../entity/Todo"

export const todoRoutes = Router()
const todoRepo = AppDataSource.getRepository(Todo)

// GET all todos
todoRoutes.get("/", async (req, res) => {
    try {
        const todos = await todoRepo.find()
        res.json(todos)
    } catch (error) {
        res.status(500).json({ message: "Error fetching todos" })
    }
})

// POST create a new todo
todoRoutes.post("/", async (req, res) => {
    try {
        const todo = todoRepo.create(req.body)
        const result = await todoRepo.save(todo)
        res.json(result)
    } catch (error) {
        res.status(500).json({ message: "Error creating todo" })
    }
})

// PUT update a todo
todoRoutes.put("/:id", async (req, res) => {
    try {
        const todo = await todoRepo.findOneBy({ id: parseInt(req.params.id) })
        if (!todo) return res.status(404).json({ message: "Todo not found" })
        todoRepo.merge(todo, req.body)
        const result = await todoRepo.save(todo)
        res.json(result)
    } catch (error) {
        res.status(500).json({ message: "Error updating todo" })
    }
})

// DELETE a todo
todoRoutes.delete("/:id", async (req, res) => {
    try {
        const todo = await todoRepo.findOneBy({ id: parseInt(req.params.id) })
        if (!todo) return res.status(404).json({ message: "Todo not found" })
        await todoRepo.remove(todo)
        res.json({ message: "Todo deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: "Error deleting todo" })
    }
})