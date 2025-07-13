export interface RecordItem {
  id: string,
  title: string;
  url: string;
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



