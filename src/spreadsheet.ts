import { google } from "googleapis";
import getAuth from "./getAuth";

export type Cell = {
  value: string;
  bgColor?: { red: number; green: number; blue: number };
  fontSize?: number;
  align?: "left" | "center" | "right";
};

const cellToValue = (cell: Cell) => {
  return {
    userEnteredValue: { stringValue: cell.value },
    userEnteredFormat: {
      backgroundColor: cell.bgColor,
      horizontalAlignment: cell.align,
      textFormat: { fontSize: cell.fontSize },
    },
  };
};

export const createSpreadSheet = async (
  cellData: Cell[][],
  title: string,
): Promise<string | null | undefined> => {
  const auth = await getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const res = await sheets.spreadsheets.create({
    requestBody: {
      properties: {
        title: title,
        locale: "ja_JP",
      },
      sheets: [
        {
          properties: { sheetId: 0 },
          data: [
            {
              startRow: 1,
              startColumn: 1,
              rowData: cellData.map((row) => ({
                values: row.map((cell) => cellToValue(cell)),
              })),
              columnMetadata: [{ pixelSize: 20 }, { pixelSize: 20 }],
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

  return res.data.spreadsheetId;
};
