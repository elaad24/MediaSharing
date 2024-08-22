import { NextFunction, Request, Response } from "express";
import express from "express";
var router = express.Router();

/* GET home page. */
router.get("/", function (req: Request, res: Response, next: NextFunction) {
  res.status(200).json({ a: "index" });
});
export default router;
