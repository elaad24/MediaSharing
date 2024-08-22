import { Request, Response, NextFunction } from "express";
import { closeDatabaseConnection } from "../config/db.js";

export function closeDbConnectionAfterReq(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.on("finish", () => {
    closeDatabaseConnection();
  });
  next();
}
