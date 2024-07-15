import { Response } from "express";
import { DBCve } from "../../interfaces/cve";
import {
  analyze_mp3_frames,
  check_abnormal_small_file_size,
  check_for_unexpected_tags,
  check_url_tags,
} from "../../utils/cvesFunctions";

const functionHashMap = {
  check_abnormal_small_file_size: check_abnormal_small_file_size,
  check_url_tags: check_url_tags,
  check_for_unexpected_tags: check_for_unexpected_tags,
  analyze_mp3_frames: analyze_mp3_frames,
};

export const mediator = (cveData: DBCve[], res: Response, filepath: string) => {
  const functionToCall = cveData.flatMap((item) => item.tests_to_run);
  for (let i = 0; i < functionToCall.length; i++) {
    functionHashMap[functionToCall[i]];
  }
};
