import { google } from "googleapis";
import getAuth from "./getAuth";

const main = async (): Promise<void> => {
  const auth = await getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.create({
    requestBody: {
      properties: {
        title: "hoho勤務時間表_2020年7月",
        locale: "ja_JP",
      },
      sheets: [
        {
          properties: { sheetId: 0 },
          data: [
            {
              startRow: 1,
              startColumn: 1,
              rowData: [
                {
                  values: [
                    {
                      userEnteredValue: { numberValue: 7 },
                      userEnteredFormat: {
                        backgroundColor: { red: 16, green: 32, blue: 16 },
                        textFormat: { fontSize: 14 },
                      },
                    },
                    { userEnteredValue: { stringValue: "月分勤務時間表" } },
                    {},
                    {},
                    {},
                    {
                      userEnteredValue: { stringValue: "氏名：" },
                      userEnteredFormat: { horizontalAlignment: "right" },
                    },
                    { formattedValue: "" },
                  ],
                },
                {
                  values: [
                    { userEnteredValue: { stringValue: "日付" } },
                    {},
                    { userEnteredValue: { stringValue: "開始時刻" } },
                    { userEnteredValue: { stringValue: "終了時刻" } },
                    { userEnteredValue: { stringValue: "休憩時間" } },
                    { userEnteredValue: { stringValue: "実稼働時間" } },
                    { userEnteredValue: { stringValue: "備考" } },
                    { formattedValue: "" },
                  ],
                },
                {
                  values: [
                    {
                      userEnteredValue: { stringValue: "365" },
                      userEnteredFormat: {
                        numberFormat: {
                          type: "date",
                          pattern: "hh+:mm(ddd)(dddd)",
                        },
                      },
                    },
                  ],
                },
              ],
            },
          ],
          merges: [
            {
              sheetId: 0,
              startRowIndex: 2,
              endRowIndex: 3,
              startColumnIndex: 1,
              endColumnIndex: 3,
            },
          ],
        },
      ],
    },
  });
  const timecard = res.data.spreadsheetId;
  console.log(timecard);
};

main();
