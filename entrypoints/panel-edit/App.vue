<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { PanelHeader, PanelList, PanelEdit } from '~/components/business/panel';
import { Record } from '~/utils/types';
import { useRecordEdit } from '~/composables/useRecordEdit';
import { useRecordStorage } from '~/composables/useRecordStorage';

defineOptions({
  name: 'PanelEdit'
})

const currentRecord = ref<Record>();
const showHistory = ref(false);
const historyList = ref<Record[]>([]);
const isShowExport = computed(() => !showHistory.value);
const params = new URLSearchParams(window.location.search);

const recordStorage = useRecordStorage();
const { updateTitle, updateItemTitle, deleteItem } = useRecordEdit(currentRecord);

onMounted(() => {
  init();
});

async function init() {
  const mapKey = params.get('mapKey');
  if (mapKey) {
    currentRecord.value = await recordStorage.getRecordById(mapKey);
  } else if (params.get('my')) {
    await handleShowHistory();
  } else {
    alert('参数错误');
    window.close();
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

async function handleDelete() {
  if (!currentRecord.value) return;
  await recordStorage.deleteRecord(currentRecord.value.id);
  currentRecord.value = undefined;
}

async function handleShowHistory() {
  historyList.value = await recordStorage.getHistoryList();
  showHistory.value = true;
  currentRecord.value = undefined;
  params.set('my', 'true');
  params.delete('mapKey');
  replaceState();
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
      <PanelEdit
        v-else
        :record="currentRecord"
        @deleteItem="deleteItem"
        @updateTitle="updateTitle"
        @updateItemTitle="updateItemTitle"
        @back="handleShowHistory"
      />
    </div>
  </div>
</template>
