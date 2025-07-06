import express from "express"
import { IUserModel, IUserSession } from "../models/User"
declare module "express-serve-static-core" {
    interface Request {
        session?: IUserSession
        user?: IUserModel
    }
}
