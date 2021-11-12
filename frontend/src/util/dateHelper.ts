export const getWeekdayInChinese = (day: number) => {
  if (day > 7 || day < 0) return 'unknown';
  const weekdayInChinese = ['日', '一', '二', '三', '四', '五', '六'];

  return weekdayInChinese[day];
};
