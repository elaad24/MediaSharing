import { NextFunction, Request, Response } from "express";
import express from "express";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/authHelper";
const router = express.Router();

/* GET users listing. */
router.post("/register", (req: Request, res: Response, next: NextFunction) => {
  const { userName, password } = req.body;
  res.status(200).json({ text: "great" });
});

router.post("/login", (req: Request, res: Response, next: NextFunction) => {
  const { userName, password } = req.body;
  const userInfo = { userName, password };
  const accessToken = generateAccessToken(userInfo);
  const refreshToken = generateRefreshToken(userInfo);
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
  });
  res.status(200).json({ accessToken });
});

export default router;
