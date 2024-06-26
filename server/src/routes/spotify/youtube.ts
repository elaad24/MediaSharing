// https://www.youtube.com/results?search_query=
import { NextFunction, Request, Response } from "express";
import express from "express";
const router = express.Router();
const app = express();
import dotenv from "dotenv";
import axios from "axios";
import {
  findVideoId,
  getAccessToken,
  getSpotifyPlayListById,
} from "../../utils/spotify";
import { error } from "console";

dotenv.config();

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

export default router;
