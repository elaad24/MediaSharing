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
import { DBCve, cveInput } from "../../interfaces/cve";

dotenv.config();
const CVES_COLLECTION_NAME = process.env.CVES_COLLECTION_NAME;
if (!CVES_COLLECTION_NAME) {
  throw new Error(
    "CVES_COLLECTION_NAME is not defined in the environment variables"
  );
}

app.use(closeDbConnectionAfterReq);

// router.get(
//   "/hashPassword",
//   async (req: Request, res: Response, next: NextFunction) => {
//     console.log(req.cookies);
//     const password = req.query.password as string;
//     const hashPassword = await hashingPassword(password);
//     res.json({ hashPassword });
//   }
// );

function isCveInput(obj: any): obj is cveInput {
  return (
    typeof obj === "object" &&
    typeof obj.cve_id === "string" &&
    typeof obj.description === "string" &&
    typeof obj.severity === "string" &&
    typeof obj.cvss_score === "string" &&
    Array.isArray(obj.indicators) &&
    obj.indicators.every((indicator: any) => typeof indicator === "string") &&
    Array.isArray(obj.mitigation) &&
    obj.mitigation.every((mitigation: any) => typeof mitigation === "string") &&
    Array.isArray(obj.references) &&
    obj.references.every((reference: any) => typeof reference === "string") &&
    Array.isArray(obj.affected_software) &&
    obj.affected_software.every(
      (affected_software: any) => typeof affected_software === "string"
    ) &&
    Array.isArray(obj.detection_methods) &&
    obj.detection_methods.every(
      (detection_method: any) => typeof detection_method === "string"
    ) &&
    Array.isArray(obj.tests_to_run) &&
    obj.detection_methods.every(
      (detection_method: any) => typeof detection_method === "string"
    ) &&
    obj.tests_to_run.length > 0
  );
}
router.post(
  "/addCve",
  async (req: Request, res: Response, next: NextFunction) => {
    const { cveInput } = req.body;
    if (!isCveInput(cveInput)) {
      return res.status(400).json({ error: "Invalid data in body req" });
    }
    try {
      const client = await connectToDatabase();

      const insertCve: DBCve = {
        cve_id: cveInput.cve_id,
        description: cveInput.description,
        severity: cveInput.severity,
        cvss_score: cveInput.cvss_score,
        indicators: cveInput.indicators,
        mitigation: cveInput.mitigation,
        references: cveInput.references,
        affected_software: cveInput.affected_software,
        detection_methods: cveInput.detection_methods,
        tests_to_run: cveInput.tests_to_run,
      };
      console.log("uscv", insertCve);

      const data = await client
        ?.collection<DBCve>(CVES_COLLECTION_NAME)
        .insertOne(insertCve);
      res.status(201).json({ text: "cve added" });
      console.log("data", data);
    } catch (error) {
      res.status(400).json({ response: "there is an error", error });
    } finally {
      closeDatabaseConnection();
    }
  }
);

export default router;
