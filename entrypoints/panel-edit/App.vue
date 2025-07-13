<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { PanelHeader, PanelList, PanelEdit } from '~/components/business/panel';
import { Record, RecordMap } from '~/utils/types';
import { getCurrentTime } from '~/utils/time';

const currentRecord = ref<Record>();
const showHistory = ref(false);
const historyList = ref<Record[]>([]);
const mapKey = new URLSearchParams(window.location.search).get('mapKey');

onMounted(() => {
  if (!mapKey) return
  storage.getItem<RecordMap>('local:dataMap').then((res) => {
    if (!res) return;
    currentRecord.value = res[mapKey];
  });
});

function handleSelectHistory(key: string) {
  storage.getItem<RecordMap>('local:dataMap').then((res) => {
    if (!res) return;
    currentRecord.value = res[key];
    showHistory.value = false;
  });
}

function handleDownload() {
  if (!currentRecord.value) return;
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(currentRecord.value));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute('href', dataStr);
  dlAnchor.setAttribute('download', `recordx-${currentRecord.value.id}.json`);
  dlAnchor.click();
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

async function handleShowHistory(list: { key: string; time: string }[]) {
  const res = await storage.getItem<RecordMap>('local:dataMap');
  if (!res) return;

  historyList.value = list.map(item => res[item.key]).filter((record): record is Record => !!record);
  showHistory.value = true;
}

function handleUpdateTitle(recordId: string, title: string) {
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
      :current-key="currentRecord?.id"
      @download="handleDownload"
      @delete="handleDelete"
      @show-history="handleShowHistory"
    />
    <div class="flex-1 overflow-auto">
      <div class="max-w-screen-xl mx-auto">
        <PanelList
          v-if="showHistory"
          :list="historyList"
          :current-key="currentRecord?.id"
          @select="handleSelectHistory"
          @updateTitle="handleUpdateTitle"
        />
        <PanelEdit
          v-else
          :record="currentRecord"
          @updateTitle="(title) => handleUpdateTitle(currentRecord!.id, title)"
        />
      </div>
    </div>
  </div>
</template>
