import React from "react";
import SpotifyList from "../../components/spotify/SpotifyList";
import songsData from "../../dummy.json";

export default function Songs() {
  return (
    <div className="">
      <SpotifyList listData={songsData} />
    </div>
  );
}
