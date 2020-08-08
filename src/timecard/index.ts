import { Cell, createSpreadSheet } from "../spreadsheet";
import { getWeek, Week } from "./date";

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

type SaturdayData = { type: "saturday"; day: number; week: Week };
type HolidayData = { type: "holiday"; day: number; week: Week };
type WorkdayData = {
  type: "workday";
  day: number;
  week: Week;
  startMinute: number;
  endMinute: number;
};
type BodyData = SaturdayData | HolidayData | WorkdayData;

const genBodyData = (
  year: number,
  month: number,
  holidays: number[],
): BodyData[] => {
  const days = new Date(year, month, 0).getDate();
  return [...Array(days).keys()].map((i) => {
    const day = i + 1;
    const week = getWeek(year, month, day);
    return week === "土"
      ? { type: "saturday", day: day, week: week }
      : holidays.includes(day + 1) || week === "日"
      ? { type: "holiday", day: day, week: week }
      : {
          type: "workday",
          day: day,
          week: week,
          startMinute: genRandomValue(48, 58),
          endMinute: genRandomValue(0, 12),
        };
  });
};

const filterWorkday = (bodyData: BodyData): bodyData is WorkdayData => {
  return bodyData.type === "workday";
};

const genBody = (year: number, month: number, holidays: number[]) => {
  const bodyData = genBodyData(year, month, holidays);
  const totalCell = genTotalCell(bodyData);
  const bodyCells = bodyData.map((data) => {
    switch (data.type) {
      case "saturday":
        return genSaturdayCell(data.day, data.week);
      case "holiday":
        return genHolidayCell(data.day, data.week);
      case "workday":
        return genWorkdayCell(data.day, data.week);
    }
  });
  return [...bodyCells, totalCell];
};

const genTotalCell = (bodyData: BodyData[]) => {
  const workdayData = bodyData.filter(filterWorkday);
  const totalMinutes =
    workdayData.length * 480 +
    workdayData
      .map((data) => 60 - data.startMinute + data.endMinute)
      .reduce((acc, x) => acc + x);
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  return [
    { value: "" },
    { value: "" },
    { value: "" },
    { value: "" },
    { value: "合計：", align: "right" },
    { value: `${hour}:${minute}`, align: "right" },
  ];
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
    { value: `9:${startMinute.toString().padStart(2, "0")}`, align: "right" },
    { value: `19:${endMinute.toString().padStart(2, "0")}`, align: "right" },
    { value: "1:00", align: "right" },
    { value: `8:${workingMinute.toString().padStart(2, "0")}`, align: "right" },
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
