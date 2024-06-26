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
export const getYoutubeSongId = async (
  songName: string,
  artists: string[]
): Promise<AxiosResponse<{ youtubeId: string }>> => {
  const artistString = artists.join(" ");
  return await axios.get(
    `${server_url}/youtube/getSong?songName=${songName}&songArtist=${artistString}`,
    {
      withCredentials: true,
    }
  );
};

// export const login = (
//   user: userLogin
// ): Promise<AxiosResponse<{ accessToken: string }>> => {
//   return axios.post(`${server_url}/auth/login`, user, {
//     withCredentials: true,
//   });
// };
