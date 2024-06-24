import axios, { AxiosResponse } from "axios";
import { server_url } from "./urls";
import { userLogin, userSignup } from "../interfaces/user";

axios.defaults.withCredentials = true;
export const register = async (user: userSignup) => {
  return await axios.post(`${server_url}/auth/register`, user, {
    withCredentials: true,
  });
};

export const login = async (
  user: userLogin
): Promise<AxiosResponse<{ accessToken: string }>> => {
  return await axios.post(`${server_url}/auth/login`, user, {
    withCredentials: true,
  });
};

export const test = async () => {
  const data = await axios.get(
    `${server_url}/auth/hashPassword?password=123456`,
    {
      withCredentials: true,
    }
  );
  console.log(data);

  return data;
};
