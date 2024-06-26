import React, { useEffect } from "react";
import { SpotifyList } from "./SpotifyList";
import downloadIcon from "../../assets/icons/downloadIcon.png";
import youtube from "../../assets/icons/youtube.png";
import { getYoutubeSongId } from "../../services/spotifyApi";

export default function ListBody({ listData }: SpotifyList) {
  useEffect(() => {
    console.log(listData);
  }, [listData]);
  const getYoutubeId = async (
    itemID: string,
    songName: string,
    artists: string[]
  ) => {
    const response = await getYoutubeSongId(songName, artists);
    const song = listData.tracks.items.filter(
      (i) => i.track.name == songName
    )[0];
    if (song.track.youtubeId == undefined) {
      console.log(response);
      song.track.youtubeId = response.data.youtubeId;
      listData.tracks.items = [...listData.tracks.items, song];
      console.log("song", song);
      console.log(listData);
    }
    return song;
  };
  const youtubeLink = () => {};
  return (
    <div className="list">
      {listData.tracks.items.map((item, index) => {
        return (
          <div className="item">
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
              onClick={() =>
                getYoutubeId(
                  "",
                  item.track.name,
                  item.track.artists.map((i) => i.name)
                )
              }
            >
              {/* <a href=""> */}
              <img className="img" src={youtube} alt="" />
              {/* </a> */}

              <button className="btn btn-outline-warning ">
                <img className="img" src={downloadIcon} alt="" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
