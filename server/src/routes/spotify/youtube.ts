import { NextFunction, Request, Response } from "express";
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
} from "../../utils/spotify";
import { error } from "console";
import {
  downloadFileToServer,
  isFileExistInGridFs,
  sendFileFromGridFs,
  uploadFileToGridFs,
} from "../../utils/database";
import { connectToDatabase, getGridFSBucket } from "../../config/db";

dotenv.config();

//! its crush the app when run - need to check why
router.get(
  "/getSong",
  async (req: Request, res: Response, next: NextFunction) => {
    const { songName, songArtist } = req.query;
    try {
      if (songName == undefined || songArtist == undefined) {
        throw error("missing query data");
      }

      if (typeof songName === "string" && typeof songArtist === "string") {
        const youtubeVideoURL = findVideoId(songName, songArtist);
        res.status(200).json({ youtubeId: youtubeVideoURL });
      } else {
        throw error("songName, songArtist either of theme is not string");
      }
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

router.get(
  "/getDownloadUrl",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { songName, songArtist, songId } = req.query;
      let youtubeSongId;
      let bucket;

      if (typeof songId === "string" && songId != "undefined") {
        youtubeSongId = songId;
        bucket = await getGridFSBucket();
        const client = await connectToDatabase();
        if (client && bucket) {
          const fileInfo = await isFileExistInGridFs(client, youtubeSongId);
          if (fileInfo) {
            await sendFileFromGridFs(bucket, fileInfo._id, res);
            return res.status(200).send("success");
          }
        }
      } else {
        if (typeof songName === "string" && typeof songArtist === "string") {
          youtubeSongId = await findVideoId(songName, songArtist);
        }

        if (youtubeSongId) {
          const downloadUrl = await getYoutubeFileDownloadLink(youtubeSongId);
          if (downloadUrl) {
            const url = await downloadFileToServer(downloadUrl);
            if (url?.fileName) {
              if (bucket) {
                await uploadFileToGridFs(bucket, url.fileName, youtubeSongId);
              }
            }
          }
          res.status(200).json({ data: downloadUrl });
        } else {
          throw error(
            "songId is undefined  and missing data  songName/songArtist"
          );
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
);

// im[lemnt this function in the getDownloadUrl api endpont in the server
router.get("/try", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const client = await connectToDatabase();
    const bucket = await getGridFSBucket();

    // const bucket = await getGridFSBucket();
    let a = null;
    if (client) {
      a = await isFileExistInGridFs(client, "Md21OZKntbg");

      if (client && bucket) {
        const fileInfo = await isFileExistInGridFs(client, "Md21OZKntbg");
        if (fileInfo) {
          await sendFileFromGridFs(bucket, fileInfo._id, res);
          return;
          //   res.status(200).send("success");
        }
      }
    }
    return res.status(200).json(a);
  } catch (error) {
    res.status(400).json(error);
  }
});

export default router;
