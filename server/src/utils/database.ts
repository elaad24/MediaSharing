import axios from "axios";
import fs from "fs";
import { MongoClient, GridFSBucket, Db, ObjectId } from "mongodb";
import { closeDatabaseConnection, connectToDatabase } from "../config/db";
import { promises } from "dns";
import { Response } from "express";

const path = require("path");

export const downloadFileToServer = async (
  url: string
): Promise<{ fileName: string | null } | undefined> => {
  try {
    let successful = null;

    const response = await axios.get(url, { responseType: "stream" });
    // console.log(response);
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
    const writer = fs.createWriteStream(`./src/downloadFiles/${filename}`);

    await response.data.pipe(writer);
    return new Promise((resolve, reject) => {
      writer.on("finish", () => {
        console.log("File successfully downloaded and saved.");
        successful = true;
        resolve({ fileName: filename });
      });
      writer.on("error", (err) => {
        console.error("Error writing the file:", err);
        successful = false;
        reject({ fileName: null });
      });
    });
  } catch (error) {
    console.error("Error downloading file", error);
  }
};

export function decodeFilename(encodedName: string) {
  return Buffer.from(encodedName, "latin1").toString("utf8");
}

export async function uploadFileToGridFs(
  bucket: GridFSBucket,
  filename: string,
  youtubeID: string
) {
  try {
    if (bucket) {
      const filePath = path.join(__dirname, `../downloadFiles/${filename}`);
      const readStream = fs.createReadStream(filePath);
      const uploadStream = bucket.openUploadStream(path.basename(filePath), {
        metadata: { youtubeID: youtubeID },
      });

      return new Promise((resolve, reject) => {
        readStream
          .pipe(uploadStream)
          .on("error", (error) => {
            console.error("Error uploading file:", error);
            reject(error);
          })
          .on("finish", async () => {
            try {
              console.log("File uploaded successfully");
              await deleteFile(filePath);
              resolve("done");
            } catch (deleteError) {
              console.error("Error deleting file:", deleteError);
              reject(deleteError);
            }
          });
      });
    }
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

export async function deleteFile(filePath: string) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    } else {
      console.log("File deleted successfully");
    }
  });
}

export async function isFileExistInGridFs(client: Db, youtubeID: string) {
  const cursor = await client
    .collection("fs.files")
    .find({ "metadata.youtubeID": youtubeID })
    .toArray();
  if (cursor.length) {
    return cursor[0];
  }
  return null;
}

export async function sendFileFromGridFs(
  bucket: GridFSBucket,
  fileMongodbObjectID: ObjectId,
  res: Response
) {
  return new Promise((resolve, reject) => {
    const downloadStream = bucket.openDownloadStream(fileMongodbObjectID);

    downloadStream.on("error", (err) => {
      console.error("Error downloading file:", err);
      res.status(500).send("Error downloading file.");
      reject(err);
    });

    downloadStream.on("file", (file) => {
      const encodedFilename = encodeURIComponent(file.filename);

      console.log("file", file);
      res.setHeader("Content-Type", "application/octet-stream");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename*=UTF-8''${encodedFilename}`
      );
    });

    downloadStream.on("end", () => {
      resolve("done");
    });
    res.status(200);

    downloadStream.pipe(res);
  });
}
