import express from "express"
import type { Application } from "express"
import { PORT } from "./config/env.config";

const app:Application=express()


app.use(express.json({
    limit:'100mb'
}))



app.listen(PORT,()=>console.log(`server is running on port ${PORT}`))