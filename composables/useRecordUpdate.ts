import { Ref } from 'vue';
import { Record, RecordItem, RecordMap } from '~/utils/types';
import { getCurrentTime } from '~/utils/time';
import { storage } from '#imports';
import { useRecordStorage } from '~/composables/useRecordStorage';
/**
 * 提供记录更新相关的功能
 * @param currentRecord 当前记录的响应式引用
 */
export async function useRecordUpdate(currentRecord: Ref<Record | null | undefined>) {
  if (!currentRecord.value) {
    const { getCurrentRecord } = useRecordStorage()
    const _currentRecord = await getCurrentRecord();
    if (_currentRecord) {
      currentRecord.value = _currentRecord;
    }
  }

  /**
   * 更新记录标题
   * @param title 新标题
   */
  async function updateTitleOnCreate(title: string) {
    if (!currentRecord.value) return;
    const record = await storage.getItem<Record>('local:currentRecord');
    if (!record) return;

    record.title = currentRecord.value.title = title;
    record.updatedAt = currentRecord.value.updatedAt = getCurrentTime();
    await storage.setItem<Record>('local:dataMap', record);
  }

  /**
   * 更新记录标题
   * @param title 新标题
   */
  async function updateTitleOnUpdate(title: string) {
    if (!currentRecord.value) return;
    const mapKey = currentRecord.value.id;
    const res = await storage.getItem<RecordMap>('local:dataMap');
    if (!res) return;
    const record = res[mapKey];
    if (!record) return;

    record.title = currentRecord.value.title = title;
    record.updatedAt = currentRecord.value.updatedAt = getCurrentTime();
    await storage.setItem('local:dataMap', res);
  }

  /**
   * 更新记录项的标题
   * @param title 新标题
   * @param item 要更新的记录项
   */
  async function updateItemTitleOnCreate(title: string, item: RecordItem) {
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

  /**
   * 更新记录项的标题
   * @param title 新标题
   * @param item 要更新的记录项
   */
  async function updateItemTitleOnUpdate(title: string, item: RecordItem) {
    if (!currentRecord.value) return;

    const res = await storage.getItem<RecordMap>('local:dataMap');

    if (!res) return;

    const mapKey = currentRecord.value.id;

    const record = res[mapKey];
    if (!record) return;

    const targetItem = record.items.find((i) => i.id === item.id);
    if (!targetItem) return;

    targetItem.title = title;
    targetItem.updatedAt = record.updatedAt = getCurrentTime();
    await storage.setItem('local:dataMap', res);

    currentRecord.value = record;
  }

  return {
    updateTitleOnCreate,
    updateTitleOnUpdate,
    updateItemTitleOnCreate,
    updateItemTitleOnUpdate,

  };
}
