<script lang="ts" setup>
import { ref, watch, toRaw, computed, provide } from 'vue';
import { Panel } from '~/components/business/panel';
import Welcome from '~/components/business/Welcome.vue';
import { messaging } from '~/utils';
import { RecordItem, Record, RECORD_STATE } from '~/utils/types';
import { createRecord, createRecordItem } from '~/utils/record';
import { useRecordCreate } from '~/composables/useRecordCreate';
import { useRecordStorage } from '~/composables/useRecordStorage';
import { useRecordState } from '~/composables/useRecordState';

const currentRecord = ref<Record | null>();

const { recordState, initState, startRecording, pausedRecording, stopRecording, resumeRecording, completeRecording } = useRecordState();
const { updateTitle, updateItemTitle, deleteItem } = await useRecordCreate(currentRecord);
const { saveCurrentRecord, saveRecord, removeCurrentRecord } = useRecordStorage();

provide('recordState', recordState);
defineOptions({ name: 'SidePanel' });

async function init() {
  await initState();
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

async function start() {
  currentRecord.value = createRecord('操作手册');
  await startRecording();
}

async function stop() {
  await stopRecording()
  await removeCurrentRecord();
  currentRecord.value = null;
}

async function complete() {
  if (!currentRecord.value) return;
  await completeRecording();
  await saveRecord(toRaw(currentRecord.value));
  await removeCurrentRecord();
  openPanelEdit(currentRecord.value.id);
  currentRecord.value = null;
}

watch(
  currentRecord,
  async (newValue) => {
    await saveCurrentRecord(newValue);
  },
  { deep: true }
);

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
  <Suspense>
    <template #default>
      <div class="w-screen h-screen">
        <Welcome @start="start" @my="openMyRecord" v-if="recordState === RECORD_STATE.COMPLETE" />
        <Panel
          v-else-if="currentRecord"
          :record="currentRecord"
          @paused="pausedRecording"
          @stop="stop"
          @resume="resumeRecording"
          @complete="complete"
          @deleteItem="deleteItem"
          @updateTitle="updateTitle"
          @updateItemTitle="updateItemTitle"
        />
      </div>
    </template>

    <template #fallback>
      <Welcome />
    </template>
  </Suspense>
</template>
