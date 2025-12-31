import { Router } from "express";
import { logout } from "../controller/auth.controller";
const authRoute = Router()


authRoute.get("/logout/:uid", logout)


export default authRoute