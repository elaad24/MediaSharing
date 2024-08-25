import React from "react";

interface ErrorContent {
  data: cveCheckerResponse;
  closeModal: () => void;
  songName: string;
}
export interface cveCheckerResponse {
  answer: boolean;
  text: string | null;
  reason: string | null;
  cve: string;
}

export default function ErrorContent({
  data,
  closeModal,
  songName,
}: ErrorContent) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "1rem",
        textTransform: "capitalize",
        textAlign: "justify",
      }}
    >
      <div style={{ alignSelf: "center" }}>
        the song {songName} is corrupted file
      </div>

      <div style={{ alignSelf: "center" }}> it's flagged by {data.cve}</div>

      <div>because {data.text}</div>

      <div>more data : {data.reason}</div>

      <button style={{ marginTop: "1rem" }} onClick={closeModal}>
        Close Modal
      </button>
    </div>
  );
}
