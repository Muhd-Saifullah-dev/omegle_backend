import { Router } from "express";
import { findMatch } from "../controller/match.controller";


const matchRoute=Router()


matchRoute.get("/find-match/:uid",findMatch)
export default matchRoute