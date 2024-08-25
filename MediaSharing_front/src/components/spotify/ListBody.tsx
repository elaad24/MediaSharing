import { SpotifyList } from "./SpotifyList";
import downloadIcon from "../../assets/icons/downloadIcon.png";
import youtube from "../../assets/icons/youtube.png";
import { downloadYoutubeSong } from "../../services/spotifyApi";
import { useState } from "react";
import Modal from "../common/Modal";
import ErrorContent, { cveCheckerResponse } from "../common/ErrorContent";

export default function ListBody({ listData }: SpotifyList) {
  const youtubeBaseLink = "https://www.youtube.com/watch?v=";
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [activeSongName, setActiveSongName] = useState("");
  const [modalData, setModalData] = useState<cveCheckerResponse>({
    answer: true,
    text: null,
    reason: null,
    cve: "",
  });

  const youtubeDownload = async (
    itemID: string,
    songName: string,
    artists: string[]
  ) => {
    try {
      const response = await downloadYoutubeSong(songName, artists, itemID);
      if (typeof response === "string") {
        setModalData(JSON.parse(response));
        setActiveSongName(songName);
      }

      // garbing the url from the api and open the window for download
      if (
        response.headers["content-type"]
          ?.toLocaleString()
          .search("application/json") != -1
      ) {
        let responseData;
        if (response.data) {
          responseData = JSON.parse(new TextDecoder().decode(response.data));

          if (responseData.data != undefined) {
            window.open(responseData.data, "_blank");
          }
        }
      } else if (
        response.headers["content-type"]
          ?.toLocaleString()
          .search("application/octet-stream") != -1
      ) {
        const blob = new Blob([response.data], {
          type: "application/octet-stream",
        });

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;

        const contentDisposition = response.headers["content-disposition"];
        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(
            /filename\*=UTF-8''(.+)$/
          );
          if (filenameMatch && filenameMatch.length === 2) {
            const filename = decodeURIComponent(filenameMatch[1]);
            link.setAttribute("download", filename);
          }
        } else {
          link.setAttribute("download", "file");
        }

        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (err: any) {
      setModalIsOpen(true);
    }
  };
  const cleanupState = () => {
    setModalData({ answer: true, text: null, reason: null, cve: "" });
    setActiveSongName("");
  };
  return (
    <div className="list">
      {modalIsOpen && (
        <Modal>
          <ErrorContent
            data={modalData}
            closeModal={() => {
              setModalIsOpen(false), cleanupState();
            }}
            songName={activeSongName}
          />
          {/* <div style={{ width: 300, height: 500 }}>
            <h2>This is a Modal</h2>
            <h2>This is a Modal</h2>
          </div> */}
        </Modal>
      )}
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
                    <div key={`${artist.name[0]}.${index}`}>
                      {artist.name}
                      {index < item.track.artists.length - 1 && " X"}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="download">
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
                    youtubeDownload(
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
