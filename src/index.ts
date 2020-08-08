import { createTimeCard } from "./timecard";

const main = async (): Promise<void> => {
  const timecardId = await createTimeCard(2020, 7, "namename", []);
  console.log(timecardId);
};

main();
