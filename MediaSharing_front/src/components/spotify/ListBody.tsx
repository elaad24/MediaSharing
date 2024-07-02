import React from "react";
import { SpotifyList } from "./SpotifyList";
import downloadIcon from "../../assets/icons/downloadIcon.png";
import youtube from "../../assets/icons/youtube.png";
import { getDownloadUrl } from "../../services/spotifyApi";

export default function ListBody({ listData }: SpotifyList) {
  const youtubeBaseLink = "https://www.youtube.com/watch?v=";

  const youtubeLink = async (
    itemID: string,
    songName: string,
    artists: string[]
  ) => {
    console.log("stttt");

    const urlDownload = await getDownloadUrl(songName, artists, itemID);
    console.log("rrrr", urlDownload);
    if (urlDownload.data && typeof urlDownload.data == "string") {
      window.open(urlDownload.data);
    }
  };
  return (
    <div className="list">
      {listData.tracks.items.map((item, index) => {
        return (
          <div
            className="item"
            id={item.track.youtubeId || item.track.id}
            key={item.track.youtubeId || item.track.id}
          >
            <div className="listNumber">{index + 1}</div>
            <div className="itemInfo">
              <div className="itemImage">
                <img
                  className="image"
                  src={item.track.album.images[0].url}
                  alt=""
                />
              </div>
              <div className="itemBody">
                {item.track.name}

                <div className="artists">
                  {item.track.artists.map((artist, index) => (
                    <div>
                      {artist.name}
                      {index < item.track.artists.length - 1 && " X"}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div
              className="download"
              // onClick={() =>
              //   getYoutubeId(
              //     item.track.id,
              //     item.track.name,
              //     item.track.artists.map((i) => i.name)
              //   )
              //   }
            >
              {item.track.youtubeId ? (
                <a
                  href={`${youtubeBaseLink}${item.track.youtubeId}`}
                  target="_blank"
                >
                  <img className="img" src={youtube} alt=" youtube img" />
                </a>
              ) : (
                <img className="img" src={youtube} alt=" youtube img" />
              )}

              <button className="btn btn-outline-warning ">
                <img
                  className="img"
                  onClick={() =>
                    youtubeLink(
                      item.track.youtubeId || "",
                      item.track.name,
                      item.track.artists.map((i) => i.name)
                    )
                  }
                  src={downloadIcon}
                  alt=""
                />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
