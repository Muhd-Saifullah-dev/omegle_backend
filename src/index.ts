import express from "express"
import type { Application } from "express"
import { PORT } from "./config/env.config";
import authRoute from "./routes/auth.route";
import userRoute from "./routes/user.route";
import matchRoute from "./routes/match.route";

const app:Application=express()


app.use(express.json({
    limit:'100mb'
}))


app.use("/api/auth",authRoute)
app.use("/api/user",userRoute)
app.use("/api/match",matchRoute)



app.listen(PORT,()=>console.log(`server is running on port ${PORT}`))