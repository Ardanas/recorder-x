import { Ref } from 'vue';
import { Record, RecordItem } from '~/utils/types';
import { getCurrentTime } from '~/utils/time';
import { storage } from '#imports';
import { useRecordStorage } from '~/composables/useRecordStorage';

/**
 * 提供记录创建阶段的更新相关功能
 * @param currentRecord 当前记录的响应式引用
 */
export async function useRecordCreate(currentRecord: Ref<Record | null | undefined>) {
  if (!currentRecord.value) {
    const { getCurrentRecord } = useRecordStorage();
    const _currentRecord = await getCurrentRecord();
    if (_currentRecord) {
      currentRecord.value = _currentRecord;
    }
  }

  /**
   * 更新记录标题
   * @param title 新标题
   */
  async function updateTitle(title: string) {
    if (!currentRecord.value) return;
    const record = await storage.getItem<Record>('local:currentRecord');
    if (!record) return;

    record.title = currentRecord.value.title = title;
    record.updatedAt = currentRecord.value.updatedAt = getCurrentTime();
    await storage.setItem<Record>('local:currentRecord', record);
  }

  /**
   * 更新记录项的标题
   * @param title 新标题
   * @param item 要更新的记录项
   */
  async function updateItemTitle(title: string, item: RecordItem) {
    if (!currentRecord.value) return;

    const record = await storage.getItem<Record>('local:currentRecord');

    if (!record) return;

    const targetItem = record.items.find((i) => i.id === item.id);
    if (!targetItem) return;

    targetItem.title = title;
    targetItem.updatedAt = record.updatedAt = getCurrentTime();
    await storage.setItem<Record>('local:currentRecord', record);
    currentRecord.value = record;
  }

  async function deleteItem(item: RecordItem) {
    const record = await storage.getItem<Record>('local:currentRecord');
    if (!record) return;
    record.items = record.items.filter((i) => i.id === item.id);
    await storage.setItem<Record>('local:currentRecord', record);
    currentRecord.value = record;
  }

  return {
    updateTitle,
    updateItemTitle,
    deleteItem
  };
}
