import { google } from "googleapis";
import getAuth from "./getAuth";
import { createTimecard } from "./spreadsheet";

const main = async (): Promise<void> => {
  const auth = await getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const timecardId = await createTimecard(sheets, 2020, 7, "namename");
  console.log(timecardId);
};

main();
