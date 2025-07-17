<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { PanelHeader, PanelList, PanelEdit } from '~/components/business/panel';
import { Record, RecordItem, RecordMap } from '~/utils/types';
import { getCurrentTime } from '~/utils/time';

const currentRecord = ref<Record>();
const showHistory = ref(false);
const historyList = ref<Record[]>([]);
const isShowExport = computed(() => !showHistory.value)
const params = new URLSearchParams(window.location.search);

async function getMyHistoryList() {
  const res = await storage.getItem<RecordMap>('local:dataMap');
  if (!res) return [];
  return Object.values(res);
}

onMounted(() => {
  init();
});

async function init() {
  const mapKey = params.get('mapKey');
  if (mapKey) {
    const res = await storage.getItem<RecordMap>('local:dataMap')
    if (!res) return
    currentRecord.value = res[mapKey];
  } else if (params.get('my')) {
    await handleShowHistory();
  }
}

function replaceState() {
  window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
}

function handleSelectHistory(record: Record) {
  currentRecord.value = record;
  showHistory.value = false;
  params.set('mapKey', record.id);
  replaceState();
}

function handleDownload(type: string) {
  if (!currentRecord.value) return;
  const url = browser.runtime.getURL(`/exports.html?mapKey=${currentRecord.value.id}&type=${type}`);
  window.open(url);
}

function handleDelete() {
  if (!currentRecord.value) return;
  storage.getItem<RecordMap>('local:dataMap').then((res) => {
    if (!res) return;
    delete res[currentRecord.value!.id];
    storage.setItem('local:dataMap', res);
    currentRecord.value = undefined;
  });
}

async function handleShowHistory() {
  historyList.value = await getMyHistoryList();
  showHistory.value = true;
  currentRecord.value = undefined;
  params.set('my', 'true');
  params.delete('mapKey');
  replaceState();
}

function handleUpdateTitle(title: string) {
  const recordId = currentRecord.value?.id;
  if (!recordId) return;
  storage.getItem<RecordMap>('local:dataMap').then((res) => {
    if (!res) return;
    const record = res[recordId];
    if (!record) return;

    record.title = title;
    record.updatedAt = getCurrentTime();
    storage.setItem('local:dataMap', res);

    if (currentRecord.value?.id === recordId) {
      currentRecord.value = record;
    }
  });
}

function handleUpdateItemTitle (title: string, item: RecordItem) {
  const recordId = currentRecord.value?.id;
  if (!recordId) return;
  storage.getItem<RecordMap>('local:dataMap').then((res) => {
    if (!res) return;
    const record = res[recordId];
    if (!record) return;

    // 查找并更新对应的 RecordItem
    const targetItem = record.items.find(i => i.id === item.id);
    if (targetItem) {
      targetItem.title = title;
      record.updatedAt = getCurrentTime();
      storage.setItem('local:dataMap', res);

      // 更新当前显示的记录
      if (currentRecord.value?.id === recordId) {
        currentRecord.value = record;
      }
    }
  });
}

function handleBack() {
  handleShowHistory()
}
</script>

<template>
  <div class="w-screen h-screen flex flex-col bg-gray-50">
    <PanelHeader
      class="sticky top-0 z-10 border-b bg-background/80 backdrop-blur"
      :show-export="isShowExport"
      @download="handleDownload"
      @delete="handleDelete"
      @show-history="handleShowHistory"
    />
    <div class="flex-1 overflow-auto container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <PanelList v-if="showHistory" :list="historyList" @select="handleSelectHistory" />
      <PanelEdit v-else
        :record="currentRecord"
        @updateTitle="handleUpdateTitle"
        @updateItemTitle="handleUpdateItemTitle"
        @back="handleBack"
      />
    </div>
  </div>
</template>
