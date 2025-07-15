<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { PanelHeader, PanelList, PanelEdit } from '~/components/business/panel';
import { Record, RecordMap } from '~/utils/types';
import { getCurrentTime } from '~/utils/time';

const currentRecord = ref<Record>();
const showHistory = ref(false);
const historyList = ref<Record[]>([]);
const params = new URLSearchParams(window.location.search);
const mapKey = params.get('mapKey');
const isOpenMyRecord = params.get('my');

async function getMyHistoryList() {
  const res = await storage.getItem<RecordMap>('local:dataMap');
  if (!res) return [];
  return Object.values(res)
}

onMounted(() => {
  init();
});

function init() {
  if (mapKey) {
    storage.getItem<RecordMap>('local:dataMap').then((res) => {
      if (!res) return;
      currentRecord.value = res[mapKey];
    });
  } else if (isOpenMyRecord) {
    handleShowHistory()
  }
}

function handleSelectHistory(record: Record) {
  currentRecord.value = record;
  showHistory.value = false;
}

function handleDownload(type: string) {
  if (!currentRecord.value) return;
  const url = browser.runtime.getURL(`/exports.html?mapKey=${mapKey}&type=${type}`);
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
}

function handleUpdateTitle(title: string) {
  const recordId = currentRecord.value?.id
  if (!recordId) return
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
</script>

<template>
  <div class="w-screen h-screen flex flex-col bg-gray-50">
    <PanelHeader
      class="sticky top-0 z-10 border-b bg-background/80 backdrop-blur"
      @download="handleDownload"
      @delete="handleDelete"
      @show-history="handleShowHistory"
    />
    <div class="flex-1 overflow-auto">
      <div class="max-w-screen-md mx-auto">
        <PanelList
          v-if="showHistory"
          :list="historyList"
          @select="handleSelectHistory"
        />
        <PanelEdit
          v-else
          :record="currentRecord"
          @updateTitle="handleUpdateTitle"
        />
      </div>
    </div>
  </div>
</template>
