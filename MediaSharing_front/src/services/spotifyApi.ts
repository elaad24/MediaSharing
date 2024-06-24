import axios, { AxiosResponse } from "axios";
import { server_url } from "./urls";
import { userLogin, userSignup } from "../interfaces/user";

axios.defaults.withCredentials = true;

export const register = async (playlistName: string) => {
  return await axios.get(
    `${server_url}/spotify/getPlaylist?playlistName=${playlistName}`,
    {
      withCredentials: true,
    }
  );
};

export const login = (
  user: userLogin
): Promise<AxiosResponse<{ accessToken: string }>> => {
  return axios.post(`${server_url}/auth/login`, user, {
    withCredentials: true,
  });
};
