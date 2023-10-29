import dayjs from 'dayjs';

dayjs.locale('ko');

const day = (
  date?: dayjs.ConfigType,
  format?: dayjs.OptionType,
  locale?: string,
  strict?: boolean
) => {
  const dayObj = Object.assign(dayjs(date, format, locale, strict), {
    todayFull() {
      return dayjs().format('YYYY-MM-DD');
    },
    defaultFormat() {
      return dayjs(date).format('YYYY-MM-DD');
    }
  });

  return dayObj;
};

export default day;
