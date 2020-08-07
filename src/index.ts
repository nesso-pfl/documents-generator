import { google } from "googleapis";
import getAuth from "./getAuth";

const main = async (): Promise<void> => {
  const auth = await getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const timecard = await sheets.spreadsheets.create();
  console.log(timecard);
};

main();
