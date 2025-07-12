<script lang="ts" setup>
import { ref } from 'vue';
import { PanelEdit } from '~/components/business/panel';
import { RecordItem } from '~/utils/types';

const urlParams = new URLSearchParams(window.location.search);
const mapKey = urlParams.get('mapKey');
const recordList = ref<RecordItem[]>([]);
storage.getItem<Record<string, RecordItem[]>>('local:dataMap').then((res) => {
  if (!res || !mapKey) return;
  recordList.value = res[mapKey];
});
</script>

<template>
  <div class="w-screen h-screen">
    <div class="max-w-screen-md mx-auto py-4" v-if="recordList.length">
        <PanelEdit :record-list="recordList"  />
    </div>
    <div v-else class="text-center text-lg">暂无数据</div>
  </div>
</template>
