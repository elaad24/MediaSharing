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
import { closeDatabaseConnection, connectToDatabase } from "../../config/db";
import {
  DBSpotifyPlaylist,
  DBSpotifyPlaylistData,
  DBSpotifyPlaylistId,
  SpotifyPlaylist,
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
const SPOTIFY_PLAYLIST_COLLECTION_NAME = process.env
  .SPOTIFY_PLAYLIST_COLLECTION_NAME as string;
if (!SPOTIFY_PLAYLIST_COLLECTION_NAME) {
  throw new Error(
    "SPOTIFY_PLAYLIST_COLLECTION_NAME is not defined in the environment variables"
  );
}

//getting access token from spotify for spotify api
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

interface addPlaylistInterface {
  playlistName: string;
  spotifyId: string;
}

// adding playlist from spotify to the database
router.post(
  "/addPlaylist",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { playlistName, spotifyId }: addPlaylistInterface = req.body;

      const accessToken = await getAccessToken(
        SPOTIFY_CLIENT_ID,
        SPOTIFY_CLIENT_SECRET
      );
      if (!accessToken) {
        throw error;
      }

      const spotifyData = await getSpotifyPlayListById(spotifyId, accessToken);

      if (spotifyData == null || playlistName == null || spotifyId == null) {
        throw error("some of the necessary data in missing");
      }

      // add youtube id for each song
      const addedYoutubePlaylistTracksItems = await Promise.all(
        spotifyData.tracks.items.map(async (item) => {
          const artist = item.track.artists.map((i) => i.name).join(" ");
          const youtubeId = await findVideoId(item.track.name, artist);
          item.track.youtubeId = youtubeId;
          return item;
        })
      );
      spotifyData.tracks.items = addedYoutubePlaylistTracksItems;

      const client = await connectToDatabase();
      const gettingPlaylistName: DBSpotifyPlaylistData = {
        playlistName: playlistName,
        spotifyId: spotifyId,
        playlistData: spotifyData,
        timeStamp: Date.now(),
      };

      const data = await client
        ?.collection<DBSpotifyPlaylistData>(SPOTIFY_PLAYLIST_COLLECTION_NAME)
        .findOneAndReplace({ spotifyId: spotifyId }, gettingPlaylistName, {
          upsert: true,
        });

      console.log("data", data);
      res.status(201).json({ text: "added playlist", playlistName });
    } catch (error) {
      console.error(error);
    } finally {
      closeDatabaseConnection();
    }
  }
);

// adding playlist header to the database
router.post(
  "/addPlaylistId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { playlistName, spotifyId } = req.body;

      const client = await connectToDatabase();
      const gettingPlaylistName: DBSpotifyPlaylistId = {
        playlistName: playlistName,
        spotifyId: spotifyId,
        timeStamp: Date.now(),
      };
      console.log("playlistRegister", gettingPlaylistName);

      const data = await client
        ?.collection<DBSpotifyPlaylistId>(SPOTIFY_COLLECTION_NAME)
        .insertOne(gettingPlaylistName);

      console.log("data", data);
      res.status(201).json({ text: "added playlist", playlistName });
    } catch (error) {
      console.error(error);
    } finally {
      closeDatabaseConnection();
    }
  }
);

// retrieving the playlist from spotify api by playlistName (the header of the playlist need to be in db header)
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
    } finally {
      closeDatabaseConnection();
    }
  }
);

// router.get("/test", async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const a = await getYoutubeFileDownloadLink("2FNJNnV9DxM");
//     res.status(200).send(a);
//   } catch (error) {
//     console.error(error);
//   }
// });

export default router;
