export type Week = "日" | "月" | "火" | "水" | "木" | "金" | "土";

export const getWeek = (year: number, month: number, day: number): Week => {
  const week = new Date(`${year}/${month}/${day}`).getDay();
  switch (week) {
    case 0:
      return "日";
    case 1:
      return "月";
    case 2:
      return "火";
    case 3:
      return "水";
    case 4:
      return "木";
    case 5:
      return "金";
    case 6:
      return "土";
    default:
      return "日";
  }
};
