export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface RecordItem {
  id: string,
  title: string;
  url: string;
  position: Position;
  size: Size;
  createdAt: string,
  updatedAt: string,
}

export interface Record {
  id: string,
  title: string,
  createdAt: string,
  updatedAt: string,
  items: RecordItem[],
}

export interface RecordMap {
  [key: string]: Record;
}

export enum RECORD_STATE {
  START = 'START',
  STOP = 'STOP',
  COMPLETE = 'COMPLETE',
}