import dayjs from 'dayjs';

export function getCurrentTime(): string {
  return dayjs().format('YYYY-MM-DD HH:mm:ss');
}

export function formatTime(time: string): string {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
}