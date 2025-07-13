<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { PanelHeader, PanelList, PanelEdit } from '~/components/business/panel';
import { RecordItem } from '~/utils/types';

const recordList = ref<RecordItem[]>([]);
const mapKey = new URLSearchParams(window.location.search).get('mapKey');
const showHistory = ref(false);
const historyList = ref<{ key: string; time: string }[]>([]);

onMounted(() => {
  storage.getItem<Record<string, RecordItem[]>>('local:dataMap').then((res) => {
    if (!res || !mapKey) return;
    recordList.value = res[mapKey] || [];
  });
});

function handleSelectHistory(key: string) {
  // 跳转到对应历史记录的编辑页面
  const url = browser.runtime.getURL(`/panel-edit.html?mapKey=${key}`);
  window.open(url);
  showHistory.value = false;
}

function handleDownload() {
  // 下载当前 recordList
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(recordList.value));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute('href', dataStr);
  dlAnchor.setAttribute('download', `recordx-${mapKey}.json`);
  dlAnchor.click();
}

function handleDelete() {
  // 删除当前 mapKey 的数据
  storage.getItem<Record<string, RecordItem[]>>('local:dataMap').then((res) => {
    if (!res || !mapKey) return;
    delete res[mapKey];
    storage.setItem('local:dataMap', res);
    recordList.value = [];
  });
}

function handleShowHistory(list: { key: string; time: string }[]) {
  historyList.value = list;
  showHistory.value = true;
}
</script>

<template>
  <div class="w-screen h-screen flex flex-col bg-background">
    <PanelHeader
      class="sticky top-0 z-10 border-b bg-background/80 backdrop-blur"
      :current-key="mapKey"
      @download="handleDownload"
      @delete="handleDelete"
      @show-history="handleShowHistory"
    />
    <div class="flex-1 overflow-auto">
      <div class="max-w-screen-md mx-auto py-4">
        <PanelList v-if="showHistory" :list="historyList" :current-key="mapKey" @select="handleSelectHistory" />
        <PanelEdit :record-list="recordList" v-else />
      </div>
    </div>
  </div>
</template>
