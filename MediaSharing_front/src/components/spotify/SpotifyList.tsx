import React from "react";
import { SpotifyPlaylist } from "../../interfaces/spotify";
import ListHeader from "./ListHeader";
import ListBody from "./ListBody";

export interface SpotifyList {
  listData: SpotifyPlaylist;
}

export default function SpotifyList({ listData }: SpotifyList) {
  return (
    <div className="SpotifyList" style={{}}>
      <ListHeader listData={listData} />
      <ListBody listData={listData} />
    </div>
  );
}
