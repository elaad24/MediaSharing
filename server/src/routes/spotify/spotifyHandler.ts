import { NextFunction, Request, Response } from "express";
import express from "express";
const router = express.Router();
const app = express();
import dotenv from "dotenv";
import axios from "axios";
import { getAccessToken, getSpotifyPlayListById } from "../../utils/spotify";
import { error } from "console";
import { connectToDatabase } from "../../config/db";
import {
  DBSpotifyPlaylist,
  DBSpotifyPlaylistId,
} from "../../interfaces/spotify";

interface AuthOptions {
  url: string;
  headers: {
    Authorization: string;
    "Content-Type": string;
  };
  form: {
    grant_type: string;
  };
  json: boolean;
}

dotenv.config();

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID as string;
if (!SPOTIFY_CLIENT_ID) {
  throw new Error(
    "SPOTIFY_CLIENT_ID is not defined in the environment variables"
  );
}
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET as string;
if (!SPOTIFY_CLIENT_SECRET) {
  throw new Error(
    "SPOTIFY_CLIENT_SECRET is not defined in the environment variables"
  );
}

const SPOTIFY_COLLECTION_NAME = process.env.SPOTIFY_COLLECTION_NAME as string;
if (!SPOTIFY_COLLECTION_NAME) {
  throw new Error(
    "SPOTIFY_COLLECTION_NAME is not defined in the environment variables"
  );
}

router.get(
  "/getAccessToken",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = await getAccessToken(
        SPOTIFY_CLIENT_ID,
        SPOTIFY_CLIENT_SECRET
      );
      if (accessToken) {
        res.status(200).json(accessToken);
      } else {
        throw error;
      }
    } catch (error) {
      res.status(400).json(error);
    }
  }
);

router.post(
  "/addPlaylistId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { playlistName, spotifyId } = req.body;

      const client = await connectToDatabase();
      const gettingPlaylistName: DBSpotifyPlaylistId = {
        playlistName: playlistName,
        spotifyId: spotifyId,
      };
      console.log("playlistRegister", gettingPlaylistName);

      const data = await client
        ?.collection<DBSpotifyPlaylistId>(SPOTIFY_COLLECTION_NAME)
        .findOne(gettingPlaylistName);

      console.log("data", data);
      res.status(201).json({ text: "added playlist", playlistName });
    } catch (error) {
      console.error(error);
    }
  }
);
router.get(
  "/getPlaylist",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { playlistName } = req.query;
      if (!playlistName || typeof playlistName !== "string") {
        throw error("no playlistname");
      }
      const client = await connectToDatabase();

      const gettingPlaylistName: DBSpotifyPlaylist = {
        playlistName: playlistName,
      };
      console.log("playlistRegister", gettingPlaylistName);

      const accessToken = await getAccessToken(
        SPOTIFY_CLIENT_ID,
        SPOTIFY_CLIENT_SECRET
      );
      if (!accessToken) {
        throw error;
      }
      const data = await client
        ?.collection<DBSpotifyPlaylistId>(SPOTIFY_COLLECTION_NAME)
        .findOne(gettingPlaylistName);
      if (data) {
        const spotifyData = await getSpotifyPlayListById(
          data.spotifyId,
          accessToken
        );
        console.log("data", data);
        res.status(200).json(spotifyData);
      } else {
        throw error("no data");
      }
    } catch (error) {
      console.error(error);
    }
  }
);

export default router;
