import axios, { AxiosHeaders, AxiosRequestHeaders } from "axios";
import { SpotifyPlaylist } from "../interfaces/spotify";
import { error } from "console";
import globalVariable from "../general/globalVariable";
export const getAccessToken = async (
  SPOTIFY_CLIENT_ID: string,
  SPOTIFY_CLIENT_SECRET: string
) => {
  const secret = `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`;

  const authOptions = {
    url: "https://accounts.spotify.com/api/token",
    method: "post",
    headers: {
      Authorization: "Basic " + Buffer.from(`${secret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: "grant_type=client_credentials",
  };

  try {
    const response = await axios(authOptions);
    if (response.status === 200) {
      const data = response.data;
      const token = data.access_token;
      console.log("data", data);

      console.log("Token:", token);
      // Use the token as needed
      return token;
    } else {
      console.error("Error: Received unexpected status code", response.status);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Axios error:",
        error.response ? error.response.data : error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
  }
};

export const getSpotifyPlayListById = async (
  playlistId: string,
  spotifyAccessToken: string
): Promise<SpotifyPlaylist> => {
  const headers = { Authorization: `Bearer ${spotifyAccessToken}` };
  const { data } = await axios.get(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    { headers }
  );
  return data;
};

export const findVideoId = async (
  songName: string,
  songArtist: string
): Promise<string> => {
  const data = await axios.get(
    `${globalVariable.youtubeSearchVideoBaseLink}${songName}+${songArtist}`
  );

  const videoId = data.data.split("watch?v=")[1].slice(0, 11);
  return videoId;
};

export const getYoutubeFileDownloadLink = async (youtubeId: string) => {
  try {
    // this is 3 main steps to get the file data
    // its an option that it will be 2 steps as well if the song is in the api cache memory
    // if it in cache memory we skip step #3

    // step #1 - get the sig from convertURL

    const firstURL = `https://nu.ummn.nu/api/v1/init?p=y&23=1llum1n471&_=${Math.random()}`;
    const Headers = {
      Accept: " */*",
      "Accept-Language": " en-US",
      Connection: " keep-alive",
      Origin: " https://ytmp3s.nu",
      Referer: " https://ytmp3s.nu/",
      "Sec-Fetch-Dest": " empty",
      "Sec-Fetch-Mode": " cors",
      "Sec-Fetch-Site": " cross-site",
      "User-Agent":
        " Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
      "sec-ch-ua":
        ' "Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"',
      "sec-ch-ua-mobile": " ?0",
      "sec-ch-ua-platform": ' "macOS"',
    };
    const firstReq = await axios.get(firstURL, { headers: Headers });
    if (firstReq.data.error !== "0") {
      throw error("there is error in #1 step of getting file ", firstReq.data);
    }

    // #2 step

    const convertURL = firstReq.data.convertURL;
    // params
    // v- is youtube link
    // f - format of the file - mp3
    // _ - Math.random

    const youtubeLink = `${globalVariable.youtubeVideoBaseLink}${youtubeId}`;
    const fileFormat = "mp3";
    const randomNumber = () => Math.random();

    const secondURL = `${convertURL}&v=${youtubeLink}&f=${fileFormat}&_=${randomNumber()}`;
    const secondReq = await axios.get(secondURL, { headers: Headers });
    if (secondReq.data.error !== 0) {
      throw error("there is error in #2 step of getting file ", secondReq.data);
    }

    // if the song in the api cache memory we skip step #3

    const secondDownloadURL = secondReq.data.downloadURL;
    if (secondDownloadURL != undefined && secondDownloadURL != "") {
      return secondDownloadURL;
    }

    const redirectURL = secondReq.data.redirectURL;

    //#3 step
    const thirdUrl = `${redirectURL}&v=${redirectURL}&f=${fileFormat}&_${randomNumber()}`;
    const thirdReq = await axios.get(thirdUrl, { headers: Headers });
    if (thirdReq.data.error !== 0) {
      throw error("there is error in #3 step of getting file ", thirdReq.data);
    }
    const downloadURL = thirdReq.data.downloadURL;

    // #4 return the downloadURL
    return downloadURL;
  } catch (error) {
    console.error(error);
  }
};
