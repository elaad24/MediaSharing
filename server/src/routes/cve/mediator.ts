import { Response } from "express";
import { DBCve } from "../../interfaces/cve";
import {
  analyze_mp3_frames,
  check_abnormal_small_file_size,
  check_abnormal_small_file_size_interface,
  check_for_unexpected_tags,
  check_url_tags,
  cveCheckerResponse,
  file_path_interface,
} from "../../utils/cvesFunctions";

type FunctionParams =
  | check_abnormal_small_file_size_interface
  | file_path_interface;

const functionHashMap: {
  [key: string]: (params: FunctionParams) => Promise<cveCheckerResponse>;
} = {
  check_abnormal_small_file_size: check_abnormal_small_file_size as (
    params: FunctionParams
  ) => Promise<cveCheckerResponse>,

  check_url_tags: check_url_tags as (
    params: FunctionParams
  ) => Promise<cveCheckerResponse>,
  check_for_unexpected_tags: check_for_unexpected_tags as (
    params: FunctionParams
  ) => Promise<cveCheckerResponse>,
  analyze_mp3_frames: analyze_mp3_frames as (
    params: FunctionParams
  ) => Promise<cveCheckerResponse>,
};

export const mediator = async (
  functionToCall: string[],
  responses: Response,
  filepath: string
) => {
  let answer;
  for (let i = 0; i < functionToCall.length; i++) {
    const func = functionHashMap[functionToCall[i]];
    if (functionToCall[i] == "check_abnormal_small_file_size") {
      answer = await func({ response: responses });
    } else if (
      functionToCall[i] == "check_url_tags" ||
      functionToCall[i] == "check_for_unexpected_tags" ||
      functionToCall[i] == "analyze_mp3_frames"
    ) {
      answer = await func({ filepath });
    }

    if (answer?.answer == false) {
      return answer;
    }
  }
  return answer;
};
