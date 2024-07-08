import { SpotifyList } from "./SpotifyList";
import downloadIcon from "../../assets/icons/downloadIcon.png";
import youtube from "../../assets/icons/youtube.png";
import { downloadYoutubeSong } from "../../services/spotifyApi";

export default function ListBody({ listData }: SpotifyList) {
  const youtubeBaseLink = "https://www.youtube.com/watch?v=";

  const youtubeDownload = async (
    itemID: string,
    songName: string,
    artists: string[]
  ) => {
    const response = await downloadYoutubeSong(songName, artists, itemID);
    // const response = await axios.get(`${server_url}/youtube/try2`);

    // grabing the url from the api and open the window for download
    if (
      response.headers["content-type"]
        ?.toLocaleString()
        .search("application/json") != -1
    ) {
      if (response.data) {
        const responseData = JSON.parse(
          new TextDecoder().decode(response.data)
        );
        if (response.data) {
          window.open(responseData.data, "_blank");
        }
      }
    } else if (
      response.headers["content-type"]
        ?.toLocaleString()
        .search("application/octet-stream") != -1
    ) {
      alert("122");
      // need to grab the stream data .
      const blob = new Blob([response.data], {
        type: "application/octet-stream",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      console.log("====================================");
      console.log("res", response);
      console.log("====================================");
      console.log(
        "response.headers['content-disposition']",
        response.headers["content-disposition"]
      );
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
