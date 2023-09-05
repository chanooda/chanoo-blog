import dayjs from 'dayjs';

dayjs.locale('ko');

const day = Object.assign(dayjs, {
  todayFull: dayjs().format('YYYY-MM-DD')
});

export default day;
