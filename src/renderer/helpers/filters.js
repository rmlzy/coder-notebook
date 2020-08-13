import dayjs from "dayjs";

export const formatTs = (ts) => {
  return dayjs(ts).format("YYYY-MM-DD");
};
