import { sheets_v4 } from "googleapis";

type Cell = {
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

const genTitle = (month: number, name: string) => {
  return [
    { value: month.toString(), fontSize: 16 },
    { value: "月分勤務時間表", fontSize: 13 },
    { value: "" },
    { value: "" },
    { value: "" },
    { value: "氏名：", align: "right" },
    { value: name },
  ];
};

const genHeader = () => {
  return [
    { value: "日付" },
    { value: "" },
    { value: "開始時間" },
    { value: "終了時間" },
    { value: "休憩時間" },
    { value: "実稼働時間" },
    { value: "備考" },
  ];
};

const genCell2d = (year: number, month: number, name: string) => {
  const days = new Date(year, month, 0).getDate();
  const body = [...Array(days).keys()].map((day) =>
    genTimeCell(year, month, day + 1, false),
  );
  return [genTitle(month, name), [], genHeader(), ...body];
};

export const createTimecard = async (
  sheets: sheets_v4.Sheets,
  year: number,
  month: number,
  name: string,
): Promise<string | null | undefined> => {
  const res = await sheets.spreadsheets.create({
    requestBody: {
      properties: {
        title: `勤務時間表_${year}年${month}月_${name}`,
        locale: "ja_JP",
      },
      sheets: [
        {
          properties: { sheetId: 0 },
          data: [
            {
              startRow: 1,
              startColumn: 1,
              rowData: genCell2d(year, month, name).map((row) => ({
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

const genTimeCell = (
  year: number,
  month: number,
  day: number,
  isHoliday: boolean,
) => {
  const week = "日月火水木金土"[new Date(`${year}/${month}/${day}`).getDay()];
  return week === "土"
    ? genSaturdayCell(day, week)
    : isHoliday || week === "日"
    ? genHolidayCell(day, week)
    : genWorkdayCell(day, week);
};

const genSaturdayCell = (day: number, week: string): Cell[] => {
  return genHolidayCell(day, week).map((cell) => ({
    ...cell,
    bgColor: { red: 55, green: 38, blue: 7 },
  }));
};

const genHolidayCell = (day: number, week: string): Cell[] => {
  return [
    { value: day.toString() },
    { value: week },
    { value: "" },
    { value: "" },
    { value: "" },
    { value: "" },
    { value: "" },
  ].map((cell) => ({ ...cell, bgColor: { red: 12, green: 52, blue: 52 } }));
};

const genWorkdayCell = (day: number, week: string): Cell[] => {
  const startMinute = genRandomValue(48, 58);
  const endMinute = genRandomValue(0, 12);
  const workingMinute = 60 - startMinute + endMinute;

  return [
    { value: day.toString() },
    { value: week },
    { value: `9:${startMinute.toString().padStart(2, "0")}` },
    { value: `19:${endMinute.toString().padStart(2, "0")}` },
    { value: "1:00" },
    { value: `8:${workingMinute.toString().padStart(2, "0")}` },
  ];
};

const genRandomValue = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};
