import {Request, Response, NextFunction } from "express";
import Blacklist from "../model/blacklist.js";
import jwt from "jsonwebtoken";

export const Authorization = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const token = req.headers.authorization

        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized: No token provided'
            });
        }

        const realToken = token.split(' ')[1];

           const isBlacklisted = await Blacklist.findOne({ token: realToken });

        if (isBlacklisted) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized: Token has been blacklisted'
            });
        }

        const decoded = jwt.verify(realToken, process.env.ACCESS_TOKEN!)
        if (!decoded) {
            return res.status(401).json({
                status: 'error',
                message: 'Unauthorized: Invalid token'
            });
        }

        (req as any).user = decoded;


        next();

} catch (error) {
        return res.status(401).json({
            status: 'error',
            message: 'Unauthorized: No token provided'
        })
    }}


const authorizationMiddleware = {
  Authorization   
}

export default authorizationMiddleware