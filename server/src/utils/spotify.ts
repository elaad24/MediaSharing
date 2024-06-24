import axios from "axios";

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
) => {
  const headers = { Authorization: `Bearer ${spotifyAccessToken}` };
  const { data } = await axios.get(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    { headers }
  );
  return data;
};
