import { NextFunction, Request, Response } from "express";
import express from "express";
import {
  checkingPassword,
  generateAccessToken,
  generateRefreshToken,
  hashingPassword,
} from "../../utils/authHelper";
import { error, log } from "console";
import { closeDatabaseConnection, connectToDatabase } from "../../config/db";
const router = express.Router();
const app = express();
import dotenv from "dotenv";
import { DBUser } from "../../interfaces/user";
import { closeDbConnectionAfterReq } from "../../middleware/closeDbConnection";

dotenv.config();
const USER_COLLECTION_NAME = process.env.USER_COLLECTION_NAME as string;
if (!USER_COLLECTION_NAME) {
  throw new Error(
    "USER_COLLECTION_NAME is not defined in the environment variables"
  );
}
const DOMAIN = process.env.DOMAIN as string;
if (!DOMAIN) {
  throw new Error("DOMAIN is not defined in the environment variables");
}

app.use(closeDbConnectionAfterReq);

router.get(
  "/hashPassword",
  async (req: Request, res: Response, next: NextFunction) => {
    console.log(req.cookies);
    const password = req.query.password as string;
    const hashPassword = await hashingPassword(password);
    res.json({ hashPassword });
  }
);

router.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    const { userName, password, email } = req.body;
    if (userName == null || password == null || email == null)
      throw error("missing data");
    try {
      const client = await connectToDatabase();
      const hashPassword = await hashingPassword(password);
      console.log("hashedpassword", hashPassword);

      const userRegister: DBUser = {
        userName: userName,
        email: email,
        password: hashPassword,
        plainPassword: password,
        role: "user",
      };
      console.log("user", userRegister);

      const data = await client
        ?.collection<DBUser>(USER_COLLECTION_NAME)
        .insertOne(userRegister);
      res.status(201).json({ text: "user added" });
      console.log("data", data);
    } catch (error) {
      res.status(400).json({ response: "there is an error", error });
    } finally {
      closeDatabaseConnection();
    }
  }
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.cookies);
      const { userName, password } = req.body;
      if (userName == null || password == null) throw error("missing data");
      const client = await connectToDatabase();

      const query = { userName: userName };
      const data = await client
        ?.collection<DBUser>(USER_COLLECTION_NAME)
        .findOne(query);
      if (data) {
        const isValidPassword = await checkingPassword(password, data.password);
        if (isValidPassword) {
          const userInfo = { userName, password };
          const accessToken = generateAccessToken(userInfo);
          const refreshToken = generateRefreshToken(userInfo);
          res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            path: "/",
            domain: DOMAIN,
          });
          res.status(200).json({ accessToken });
        } else {
          throw error;
        }
      } else {
        res.status(400).json({ response: "wrong info" });
      }
    } catch (error) {
      res.status(400).json({ response: "wrong info" });
    } finally {
      closeDatabaseConnection();
    }
  }
);

export default router;
