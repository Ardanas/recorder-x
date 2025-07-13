import type { Record, RecordItem } from './types';
import { getCurrentTime } from './time';

function generateId(): string {
  return Date.now().toString();
}

export function createRecord(title: string): Record {
  const id = generateId();
  const time = getCurrentTime();
  
  return {
    id,
    title,
    items: [],
    createdAt: time,
    updatedAt: time,
  };
}

export function createRecordItem(title: string, url: string): RecordItem {
  const id = generateId();
  const time = getCurrentTime();

  return {
    id,
    title,
    url,
    createdAt: time,
    updatedAt: time,
  };
}