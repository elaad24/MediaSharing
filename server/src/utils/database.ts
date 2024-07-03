import axios from "axios";
import fs from "fs";
export const savingFileToDb = async (url: string) => {
  try {
    const response = await axios.get(url, { responseType: "stream" });
    console.log(response);
    console.log(`Status: ${response.status}`);
    console.log(`Status Text: ${response.statusText}`);
    console.log(`Headers:`, response.headers);

    // Handling content-disposition header to get the filename
    const contentDisposition = response.headers["content-disposition"];
    let filename = "downloaded_file";
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="(.+?)"/);

      if (match.length === 2) filename = decodeFilename(match[1]);
    }

    // Saving the file
    const writer = fs.createWriteStream(`../downloadFiles/${filename}`);

    response.data.pipe(writer);
    writer.on("finish", () => {
      console.log("File successfully downloaded and saved.");
    });
    writer.on("error", (err) => {
      console.error("Error writing the file:", err);
    });
  } catch (error) {
    console.error("Error downloading file", error);
  }
};

export function decodeFilename(encodedName: string) {
  return Buffer.from(encodedName, "latin1").toString("utf8");
}
