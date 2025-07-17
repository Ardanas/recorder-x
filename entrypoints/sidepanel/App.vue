<script lang="ts" setup>
import { ref, watch, toRaw, computed, provide } from 'vue';
import { Panel } from '~/components/business/panel';
import Welcome from '~/components/business/Welcome.vue';
import { messaging } from '~/messaging';
import { storage } from '#imports';
import { RecordItem, Record, RecordMap, RECORD_STATE } from '~/utils/types';
import { createRecord, createRecordItem } from '~/utils/record';
import { getCurrentTime } from '~/utils/time';

const recordState = ref<RECORD_STATE>(RECORD_STATE.COMPLETE);
const currentRecord = ref<Record | null>();

// 提供 recordState 给子组件
provide('recordState', recordState);

function handleUpdateTitle(newTitle: string) {
  if (currentRecord.value) {
    currentRecord.value.title = newTitle;
    currentRecord.value.updatedAt = getCurrentTime();
  }
}

function handleUpdateItemTitle(title: string, item: RecordItem) {}

async function init() {
  const _recordState = await storage.getItem<RECORD_STATE>('local:recordState');
  recordState.value = _recordState || RECORD_STATE.COMPLETE;
  const _currentRecord = await storage.getItem<Record>('local:currentRecord');
  if (_currentRecord) {
    currentRecord.value = _currentRecord;
  }
}

init();

function openMyRecord() {
  const url = browser.runtime.getURL(`/panel-edit.html?my=true`);
  window.open(url);
}

function openPanelEdit(key: string) {
  const url = browser.runtime.getURL(`/panel-edit.html?mapKey=${key}`);
  window.open(url);
}

async function handleStartState() {
  recordState.value = RECORD_STATE.START;
  await storage.setItem('local:recordState', RECORD_STATE.START);
  await messaging.sendMessage('start', undefined);
}

async function start() {
  currentRecord.value = createRecord('录制记录');
  await handleStartState();
}

async function stop() {
  recordState.value = RECORD_STATE.STOP;
  await storage.setItem('local:recordState', RECORD_STATE.STOP);
  await messaging.sendMessage('stop', undefined);
}

async function resume() {
  await handleStartState();
}

async function complete() {
  if (!currentRecord.value) return;
  recordState.value = RECORD_STATE.COMPLETE;
  await storage.setItem('local:recordState', RECORD_STATE.COMPLETE);
  await updateDataMap();
  openPanelEdit(currentRecord.value.id);
  currentRecord.value = null;
}

async function updateDataMap() {
  const res = await storage.getItem<RecordMap>('local:dataMap');
  const dataMap = res || {};
  const key = currentRecord.value!.id;
  dataMap[key] = toRaw(currentRecord.value!);
  await storage.setItem<RecordMap>('local:dataMap', dataMap);
}

watch(currentRecord, async (newValue) => {
  if (!newValue) {
    await storage.removeItem('local:currentRecord');
  } else {
    await storage.setItem<Record>('local:currentRecord', toRaw(newValue));
  }
}, { deep: true })

messaging.onMessage('captureDone', async ({ data }) => {
  const info: RecordItem = createRecordItem(
    data.text,
    data.screenshot,
    { x: data.clientX, y: data.clientY },
    { width: data.imageWidth, height: data.imageHeight }
  );
  currentRecord.value!.items.push(info);
});
</script>

<template>
  <div class="w-screen h-screen">
    <Welcome @start="start" @my="openMyRecord" v-if="recordState === RECORD_STATE.COMPLETE" />
    <Panel
      v-else-if="currentRecord"
      :record="currentRecord"
      @stop="stop"
      @resume="resume"
      @complete="complete"
      @updateTitle="handleUpdateTitle"
    />
  </div>
</template>
