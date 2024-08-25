import { NextFunction, Request, Response, response } from "express";
import express from "express";
const router = express.Router();
const app = express();
import dotenv from "dotenv";
import axios from "axios";
import globalVariable from "../../general/globalVariable";
import {
  findVideoId,
  getAccessToken,
  getSpotifyPlayListById,
  getYoutubeFileDownloadLink,
} from "../../utils/spotify.js";
import { error } from "console";
import {
  deleteFile,
  downloadFileToServer,
  isFileExistInGridFs,
  sendFileFromGridFs,
  uploadFileToGridFs,
} from "../../utils/database.js";
import { connectToDatabase, getGridFSBucket } from "../../config/db.js";
import { DBCve } from "../../interfaces/cve.js";
import { mediator } from "../cve/mediator.js";
import * as fs from "fs";

dotenv.config();

const CVES_COLLECTION_NAME = process.env.CVES_COLLECTION_NAME;
if (!CVES_COLLECTION_NAME) {
  throw new Error(
    "CVES_COLLECTION_NAME is not defined in the environment variables"
  );
}

//getting youtube video id
router.get(
  "/getSong",
  async (req: Request, res: Response, next: NextFunction) => {
    const { songName, songArtist } = req.query;
    try {
      if (songName == undefined || songArtist == undefined) {
        throw error("missing query data");
      }

      if (typeof songName === "string" && typeof songArtist === "string") {
        const youtubeVideoId = findVideoId(songName, songArtist);
        res.status(200).json({ youtubeId: youtubeVideoId });
      } else {
        throw error("songName, songArtist either of theme is not string");
      }
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

// download the song to the db or retrieving it if in db
router.get(
  "/DownloadSong",
  async (req: Request, res: Response, next: NextFunction) => {
    let fileName = null;
    try {
      const { songName, songArtist, songId } = req.query;
      let isFileInDB = null;
      if (
        (typeof songId !== "string" ||
          songId == "undefined" ||
          songId.length <= 1) &&
        (!songName || !songArtist)
      ) {
        throw error(
          "songId is undefined  and missing data  songName/songArtist"
        );
      }
      let youtubeSongId;
      const bucket = await getGridFSBucket();
      const client = await connectToDatabase();

      // checking if there is songid
      if (
        typeof songId === "string" &&
        songId.length > 1 &&
        songId != "undefined"
      ) {
        youtubeSongId = songId;
        if (client && bucket) {
          const fileInfo = await isFileExistInGridFs(client, youtubeSongId);
          if (fileInfo) {
            await sendFileFromGridFs(bucket, fileInfo._id, res);
          } else {
            isFileInDB = false;
          }
        }
      } else {
        if (typeof songName === "string" && typeof songArtist === "string") {
          youtubeSongId = await findVideoId(songName, songArtist);
        }
      }

      if (client && bucket) {
        if (isFileInDB !== false) {
          const fileInfo = await isFileExistInGridFs(client, youtubeSongId);
          if (fileInfo) {
            await sendFileFromGridFs(bucket, fileInfo._id, res);
          }
        } else {
          if (youtubeSongId) {
            const downloadUrl = await getYoutubeFileDownloadLink(youtubeSongId);
            if (downloadUrl) {
              const filePromise = await downloadFileToServer(downloadUrl);
              fileName = filePromise.fileName;
              const databaseCves = await client
                ?.collection<DBCve>(CVES_COLLECTION_NAME)
                .find()
                .toArray();

              const tests_to_run = databaseCves.flatMap(
                (cve) => cve.tests_to_run
              );

              if (filePromise?.fileName) {
                const isFileClean = await mediator(
                  tests_to_run,
                  res,
                  `./src/downloadFiles/${filePromise.fileName}`
                );

                if (isFileClean == undefined || isFileClean.answer == false) {
                  throw error(
                    `file has found and dangerous by  ${isFileClean.cve}, ${isFileClean.text} , description : ${isFileClean.reason}`
                  );
                }
                if (bucket) {
                  await uploadFileToGridFs(
                    bucket,
                    filePromise.fileName,
                    youtubeSongId
                  );
                }
              }
            }
            res.status(200).json({ data: downloadUrl });
          }
        }
      } else {
        console.error("coudent connect to client db and bucket db ");
      }
    } catch (error) {
      console.error(error);
      if (fs.existsSync(`./src/downloadFiles/${fileName}`)) {
        await deleteFile(`./src/downloadFiles/${fileName}`);
      }
      res.status(400).json(error);
    }
  }
);

export default router;
