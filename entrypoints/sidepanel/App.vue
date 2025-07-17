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
const currentRecord = ref<Record>(createRecord('录制记录'));

// 提供 recordState 给子组件
provide('recordState', recordState);

function updateRecordTitle(newTitle: string) {
  if (currentRecord.value) {
    currentRecord.value.title = newTitle;
    currentRecord.value.updatedAt = getCurrentTime();
  }
}

async function init() {
  const res = await storage.getItem<RECORD_STATE>('local:recordState');
  recordState.value = res || RECORD_STATE.COMPLETE;
}

init();

async function start() {
  recordState.value = RECORD_STATE.START;
  await storage.setItem<RECORD_STATE>('local:recordState', RECORD_STATE.START);
  messaging.sendMessage('start', undefined);
}

async function stop() {
  recordState.value = RECORD_STATE.STOP;
  await storage.setItem<RECORD_STATE>('local:recordState', RECORD_STATE.STOP);
  messaging.sendMessage('stop', undefined);
}

async function resume() {
  recordState.value = RECORD_STATE.START;
  await storage.setItem<RECORD_STATE>('local:recordState', RECORD_STATE.START);
  messaging.sendMessage('start', undefined);
}

function openMyRecord() {
  const url = browser.runtime.getURL(`/panel-edit.html?my=true`);
  window.open(url);
}

function openPanelEdit(key: string) {
  const url = browser.runtime.getURL(`/panel-edit.html?mapKey=${key}`);
  window.open(url);
}

async function complete() {
  currentRecord.value.updatedAt = getCurrentTime();
  const record = toRaw(currentRecord.value);
  currentRecord.value = createRecord(currentRecord.value.title);

  const res = await storage.getItem<RecordMap>('local:dataMap');
  const dataMap = res || {};
  const key = record.id;
  dataMap[key] = record;
  storage.setItem('local:dataMap', dataMap);
  recordState.value = RECORD_STATE.COMPLETE;
  await storage.setItem<RECORD_STATE>('local:recordState', RECORD_STATE.COMPLETE);
  openPanelEdit(key);
}

messaging.onMessage('captureDone', async ({ data }) => {
  const info: RecordItem = createRecordItem(
    data.text,
    data.screenshot,
    { x: data.clientX, y: data.clientY },
    { width: data.imageWidth, height: data.imageHeight }
  );
  currentRecord.value.items.push(info);
});
</script>

<template>
  <div class="w-screen h-screen">
    <Welcome @start="start" @my="openMyRecord" v-if="recordState === RECORD_STATE.COMPLETE" />
    <Panel
      :record="currentRecord"
      @stop="stop"
      @resume="resume"
      @complete="complete"
      @updateTitle="updateRecordTitle"
      v-else
    />
  </div>
</template>
