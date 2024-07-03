import axios from "axios";
import fs from "fs";
import { GridFSBucket } from "mongodb";
import { closeDatabaseConnection, connectToDatabase } from "../config/db";
import { error } from "console";
const path = require("path");

export const downloadFileToServer = async (url: string) => {
  try {
    const response = await axios.get(url, { responseType: "stream" });
    console.log(response);
    console.log(`Status: ${response.status}`);
    console.log(`Status Text: ${response.statusText}`);
    console.log(`Headers:`, response.headers);

    // Handling content-disposition header to get the filename
    const contentDisposition = response.headers["content-disposition"];
    let filename = "downloaded_file";
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+?)"/);

      if (match.length === 2) filename = decodeFilename(match[1]);
    }

    // Saving the file
    const writer = fs.createWriteStream(`../downloadFiles/${filename}`);

    response.data.pipe(writer);
    writer.on("finish", () => {
      console.log("File successfully downloaded and saved.");
    });
    writer.on("error", (err) => {
      console.error("Error writing the file:", err);
    });
  } catch (error) {
    console.error("Error downloading file", error);
  }
};

export function decodeFilename(encodedName: string) {
  return Buffer.from(encodedName, "latin1").toString("utf8");
}

export async function uploadFileToGridFs(filename: string) {
  // this is the value that need to pass - const database = client.db(dbName);
  const client = await connectToDatabase();
  try {
    if (client) {
      const bucket = new GridFSBucket(client);

      const filePath = path.join(__dirname, `../downloadFiles/${filename}`);
      const readStream = fs.createReadStream(filePath);
      const uploadStream = bucket.openUploadStream(path.basename(filePath));

      readStream
        .pipe(uploadStream)
        .on("error", (error) => {
          console.error("Error uploading file:", error);
          throw error;
        })
        .on("finish", () => {
          console.log("File uploaded successfully");
          deleteFile(filePath);
        });
    }
  } catch (error) {
    console.error("Error uploading file:", error);
  } finally {
    closeDatabaseConnection();
  }
}

export async function deleteFile(filePath: string) {
  await fs.rmdirSync(filePath);
}
