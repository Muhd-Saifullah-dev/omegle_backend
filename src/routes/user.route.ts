import { Router } from "express";
import { createUser } from "../controller/user.controller";

const userRoute = Router()


userRoute.post("/create-profile", createUser)

export default userRoute