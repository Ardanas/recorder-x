import { Ref, toRaw } from 'vue';
import { Record, RecordMap } from '~/utils/types';
import { storage } from '#imports';

/**
 * 提供记录存储相关的功能
 */
export function useRecordStorage() {
  /**
   * 获取所有历史记录列表
   * @returns 记录列表
   */
  async function getHistoryList(): Promise<Record[]> {
    const res = await storage.getItem<RecordMap>('local:dataMap');
    if (!res) return [];
    return Object.values(res);
  }

  /**
   * 根据ID获取记录
   * @param recordId 记录ID
   * @returns 记录对象，如果不存在则返回undefined
   */
  async function getRecordById(recordId: string): Promise<Record | undefined> {
    const res = await storage.getItem<RecordMap>('local:dataMap');
    if (!res) return undefined;
    return res[recordId];
  }

  /**
   * 保存记录到存储
   * @param record 要保存的记录
   */
  async function saveRecord(record: Record): Promise<void> {
    const res = await storage.getItem<RecordMap>('local:dataMap');
    const dataMap = res || {};
    dataMap[record.id] = record;
    await storage.setItem<RecordMap>('local:dataMap', dataMap);
  }

  /**
   * 删除记录
   * @param recordId 要删除的记录ID
   * @returns 是否删除成功
   */
  async function deleteRecord(recordId: string): Promise<boolean> {
    const res = await storage.getItem<RecordMap>('local:dataMap');
    if (!res || !res[recordId]) return false;

    delete res[recordId];
    await storage.setItem('local:dataMap', res);
    return true;
  }

  /**
   * 保存当前记录到本地存储
   * @param currentRecord 当前记录的引用
   * @param rawTransform 是否需要转换为原始对象（用于Vue的响应式对象）
   */
  async function saveCurrentRecord(currentRecord: Record | null | undefined, rawTransform = true): Promise<void> {
    if (!currentRecord) {
      await storage.removeItem('local:currentRecord');
    } else {
      // 确保currentRecord是Record类型
      const record = currentRecord as Record;
      await storage.setItem<Record>('local:currentRecord', rawTransform ? toRaw(record) : record);
    }
  }

  async function getCurrentRecord(): Promise<Record | null> {
    return await storage.getItem<Record>('local:currentRecord');
  }

  return {
    getHistoryList,
    getRecordById,
    saveRecord,
    deleteRecord,
    saveCurrentRecord,
    getCurrentRecord
  };
}