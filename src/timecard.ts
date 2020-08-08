import { Cell, createSpreadSheet } from "./spreadsheet";

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

const genBody = (year: number, month: number, holidays: number[]) => {
  const days = new Date(year, month, 0).getDate();
  return [...Array(days).keys()].map((day) =>
    genTimeCell(year, month, day + 1, holidays.includes(day + 1)),
  );
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

export const createTimeCard = async (
  year: number,
  month: number,
  name: string,
  holidays: number[],
): Promise<string | null | undefined> => {
  const title = `勤務時間表_${year}年${month}月_${name}`;
  const cd = [
    genTitle(month, name),
    [],
    genHeader(),
    ...genBody(year, month, holidays),
  ];

  return await createSpreadSheet(cd, title);
};
