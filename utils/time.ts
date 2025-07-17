import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';

// 注册相对时间插件
dayjs.extend(relativeTime);
// 设置语言为中文
dayjs.locale('zh-cn');

export function getCurrentTime(): string {
  return dayjs().format('YYYY-MM-DD HH:mm:ss');
}

export function formatTime(time: string): string {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
}

/**
 * 获取相对时间（如：几分钟前，几小时前，几天前等）
 * @param time 时间字符串或时间戳
 * @returns 相对时间字符串
 */
export function getRelativeTime(time: string | number): string {
  return dayjs(time).fromNow();
}