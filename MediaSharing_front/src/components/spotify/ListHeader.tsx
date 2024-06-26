import React from "react";
import { SpotifyList } from "./SpotifyList";

export default function ListHeader({ listData }: SpotifyList) {
  return (
    <div className="titleBlock">
      <div className="textPart">
        <div className="title">{listData.name}</div>
        <div className="description">{listData.description}</div>
        <div className="stats">
          <div className="followers">
            # followers : {listData.followers.total}
          </div>
          <div className="createdBy">
            created by - {listData.owner.display_name}
          </div>
        </div>
      </div>
      <div className="imagePart">
        <div className="playlistImag">
          <img
            className="img"
            src={listData.images[0].url}
            alt="playlist Imag icon"
          />
        </div>
      </div>
    </div>
  );
}
