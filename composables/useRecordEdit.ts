import { Ref } from 'vue';
import { Record, RecordItem, RecordMap } from '~/utils/types';
import { getCurrentTime } from '~/utils/time';
import { storage } from '#imports';

/**
 * 提供记录编辑阶段的更新相关功能
 * @param currentRecord 当前记录的响应式引用
 */
export function useRecordEdit(currentRecord: Ref<Record | null | undefined>) {
  /**
   * 更新记录标题
   * @param title 新标题
   */
  async function updateTitle(title: string) {
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
  async function updateItemTitle(title: string, item: RecordItem) {
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

  async function deleteItem(item: RecordItem) {
    if (!currentRecord.value) return;

    const res = await storage.getItem<RecordMap>('local:dataMap');
    if (!res) return;

    const mapKey = currentRecord.value.id;
    const record = res[mapKey];
    if (!record) return;

    record.items = record.items.filter((i) => i.id === item.id);
    await storage.setItem('local:dataMap', res);
    currentRecord.value = record;
  }

  return {
    updateTitle,
    updateItemTitle,
    deleteItem,
  };
}
