import { Response } from "express";
import { parseFile } from "music-metadata";
import * as fs from "fs";
import {
  calculateFrameSize,
  getBitrate,
  getSampleRate,
  isSuspiciousUrl,
  isValidFrameHeader,
} from "./cvesHelper";
import { rejects } from "assert";

// if it true so its okay ,
//! if false then its a problem

export interface cveCheckerResponse {
  answer: boolean;
  text: string | null;
  reason: string | null;
  cve: string;
}
export interface check_abnormal_small_file_size_interface {
  response: Response;
}

export interface file_path_interface {
  filepath: string;
}

export const check_abnormal_small_file_size = ({
  response,
}: check_abnormal_small_file_size_interface): Promise<cveCheckerResponse> => {
  return new Promise((resolve, reject) => {
    const responseHeaders = response.getHeaders();
    const ans =
      responseHeaders["content-length"] != undefined &&
      Number(responseHeaders["content-length"]) > 10240;
    if (ans) {
      return resolve({
        answer: ans,
        cve: "CVE-2017-15288",
        text: null,
        reason: null,
      });
    } else {
      return reject({
        answer: false,
        cve: "CVE-2017-15288",
        text: "file size too small",
        reason: "file size under 10kb",
      });
    }
  });
};

export const check_url_tags = async ({
  filepath,
}: file_path_interface): Promise<cveCheckerResponse> => {
  try {
    const metadata = await parseFile(filepath);
    // ID3 tag that are specifically associated with URLs in MP3 metadata
    const urlTags = ["WXXX", "WOAR", "WOAS", "WOAF"];
    let suspiciousUrls: string[] = [];

    urlTags.forEach((tag) => {
      if (metadata.common[tag]) {
        const url = metadata.common[tag];
        if (isSuspiciousUrl(url)) {
          suspiciousUrls.push(url);
        }
      }
    });

    if (suspiciousUrls.length > 0) {
      console.log("Suspicious URLs found:", suspiciousUrls);
      return {
        answer: false,
        cve: "CVE-2017-15288",
        text: " check_url_tags problem",
        reason: `Suspicious URLs found:, ${suspiciousUrls}`,
      };
    } else {
      console.log("No suspicious URLs found.");
      return { answer: true, cve: "CVE-2017-15288", text: null, reason: null };
    }
  } catch (error) {
    console.error("Error reading MP3 metadata:", error);
    return {
      answer: false,
      cve: "CVE-2017-15288",
      text: "Error reading MP3 metadata",
      reason: JSON.stringify(error) || "unknown error",
    };
  }
};

export const check_for_unexpected_tags = async ({
  filepath,
}: file_path_interface): Promise<cveCheckerResponse> => {
  try {
    const metadata = await parseFile(filepath);
    const maxMetadataSize = 1024 * 10;
    const metadataSize = Buffer.byteLength(JSON.stringify(metadata.common));
    // check for matadata size
    if (metadataSize > maxMetadataSize) {
      console.log(`Large metadata size detected: ${metadataSize} bytes`);
      return {
        answer: false,
        cve: "CVE-2019-12874",
        text: "Large metadata size detected",
        reason: `${metadataSize} bytes is to large for headers`,
      };
    } else {
      console.log(
        `Metadata size is within normal range: ${metadataSize} bytes`
      );
    }

    // check for unexpected ID3

    const allowedTags = [
      "TIT2",
      "TPE1",
      "TALB",
      "TRCK",
      "TYER",
      "TCON",
      "COMM",
      "TXXX",
      "WXXX",
      "WOAR",
      "WOAS",
      "WOAF",
    ];
    const foundTags = Object.keys(metadata.common);
    const unexpectedTags = foundTags.filter(
      (tag) => !allowedTags.includes(tag)
    );

    if (unexpectedTags.length > 0) {
      console.log("Unexpected ID3 tags found:", unexpectedTags);
      return {
        answer: false,
        cve: "CVE-2019-12874",
        text: "Unexpected ID3 tags found",
        reason: `${unexpectedTags} is unexpected ID3`,
      };
    } else {
      console.log("No unexpected ID3 tags found.");
      return {
        answer: true,
        cve: "CVE-2019-12874",
        text: null,
        reason: null,
      };
    }
  } catch (error) {
    return {
      answer: false,
      cve: "CVE-2019-12874",
      text: "Error reading MP3 metadata",
      reason: JSON.stringify(error) || "unknown error",
    };
  }
};

// Function to read an MP3 file and analyze its frames
export const analyze_mp3_frames = ({
  filepath,
}: file_path_interface): Promise<cveCheckerResponse> => {
  return new Promise((resolve, reject) => {
    const fileBuffer = fs.readFileSync(filepath);
    let offset = 0;

    while (offset < fileBuffer.length) {
      const frameHeader = fileBuffer.slice(offset, offset + 4);

      if (frameHeader.length < 4) break;

      // Check sync bits (first 11 bits should be set to 1)
      if (frameHeader[0] === 0xff && (frameHeader[1] & 0xe0) === 0xe0) {
        // Extract frame information
        const versionBits = (frameHeader[1] & 0x18) >> 3;
        const layerBits = (frameHeader[1] & 0x06) >> 1;
        const bitrateBits = (frameHeader[2] & 0xf0) >> 4;
        const sampleRateBits = (frameHeader[2] & 0x0c) >> 2;
        const paddingBit = (frameHeader[2] & 0x02) >> 1;

        // Check for unexpected values
        if (
          !isValidFrameHeader(
            versionBits,
            layerBits,
            bitrateBits,
            sampleRateBits
          )
        ) {
          console.log(`Unexpected frame header values at offset ${offset}`);
          return reject({
            answer: false,
            cve: "CVE-2020-21674",
            text: "Unexpected frame header",
            reason: `Unexpected frame header values at offset ${offset}`,
          });
        }

        // Calculate frame size
        const bitrate = getBitrate(versionBits, layerBits, bitrateBits);
        const sampleRate = getSampleRate(versionBits, sampleRateBits);
        const frameSize = calculateFrameSize(bitrate, sampleRate, paddingBit);

        if (frameSize <= 0 || frameSize > 1441) {
          // 1441 bytes is the maximum possible frame size for MP3
          console.log(
            `Abnormal frame size (${frameSize} bytes) at offset ${offset}`
          );
          return reject({
            answer: false,
            cve: "CVE-2020-21674",
            text: "Abnormal frame size",
            reason: `Abnormal frame size (${frameSize} bytes) at offset ${offset}`,
          });
        }

        offset += frameSize;
      } else {
        // Move to the next byte if sync bits are not found
        offset += 1;
      }
    }

    return resolve({
      answer: true,
      cve: "CVE-2020-21674",
      text: null,
      reason: null,
    });
  });
};
