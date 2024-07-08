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
  "/DownloadSong",
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
          } else {
            if (
              typeof songName === "string" &&
              typeof songArtist === "string"
            ) {
              youtubeSongId = await findVideoId(songName, songArtist);
            }
            if (youtubeSongId) {
              const downloadUrl = await getYoutubeFileDownloadLink(
                youtubeSongId
              );
              if (downloadUrl) {
                const url = await downloadFileToServer(downloadUrl);
                if (url?.fileName) {
                  if (bucket) {
                    await uploadFileToGridFs(
                      bucket,
                      url.fileName,
                      youtubeSongId
                    );
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
        }
      }
    }
    // return res.status(200).json(a);
  } catch (error) {
    res.status(400).json(error);
  }
});
router.get("/try2", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const a = "content-type";
    const b = "application/json";
    const c = "application/octet-stream";
    const d =
      "https://nnmu.ummn.nu/api/v1/download?sig=iO8gSflUBAG9S1GyDkWSySROKakgD6t54ZQEv1j7Ig50Ya8aESy%2BYbf3KUQZOq3a6azjm%2Fj5lGoMFnKkY%2FN8U68DM%2BvUUN8zDO8Qd8S2popCAgkdiiyvYr0Q%2BFzRlfH%2FRGjuUE6HoME82FR3KBc5s%2BUiFHBz8aTIomuvh9tL88ZJJa5B07Soa0S43BNFFjXbWDIw5tdEs%2FjGe%2FwyKtmfBgU5nMsM%2Fn0nJo4HPmba%2BX%2BbULeAZWsQbYtoQ0FwPKi8BUbXce3Zfq3K2qlypTd1WI2FLm4Jjyd5Lh8KpYwBPv6Ew3eb55TpdkGE2yvbKCcz%2FUK02PwgYnuQP8nKfrT95w%3D%3D";
    res.status(200).setHeader(a, b).json({ data: d });
    // return res.status(200).json(a);
  } catch (error) {
    res.status(400).json(error);
  }
});

export default router;
