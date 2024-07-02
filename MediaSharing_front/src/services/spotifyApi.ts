import axios, { AxiosResponse } from "axios";
import { server_url } from "./urls";

axios.defaults.withCredentials = true;

export const getSpotifyPlaylist = async (playlistName: string) => {
  return await axios.get(
    `${server_url}/spotify/getPlaylist?playlistName=${playlistName}`,
    {
      withCredentials: true,
    }
  );
};
// change it instead of requesting each every time it will request in the server all in the same time;
// export const getYoutubeSongId = async (
//   songName: string,
//   artists: string[]
// ): Promise<AxiosResponse<{ youtubeId: string }>> => {
//   const artistString = artists.join(" ");
//   return await axios.get(
//     `${server_url}/youtube/getSong?songName=${songName}&songArtist=${artistString}`,
//     {
//       withCredentials: true,
//     }
//   );
// };

export const getDownloadUrl = async (
  songName: string,
  artists: string[],
  songId?: string
) => {
  const artistString = artists.join(" ");
  let querySongId = "";
  if (songId != undefined) {
    querySongId = `&songId=${songId}`;
  }

  const querySongName = `songName=${songName}`;
  const songArtistsName = `&songArtist=${artistString}`;

  const query = `${querySongName}${songArtistsName}${querySongId}`;
  console.log("query", query);

  const { data } = await axios.get(
    `${server_url}/youtube/getDownloadUrl?${query}`,
    {
      withCredentials: true,
    }
  );
  return data;
};

// export const login = (
//   user: userLogin
// ): Promise<AxiosResponse<{ accessToken: string }>> => {
//   return axios.post(`${server_url}/auth/login`, user, {
//     withCredentials: true,
//   });
// };
