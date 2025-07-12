
<template>
  <div>
    <Card v-for="(item, index) in props.recordList" :key="index">
      <CardHeader class="p-4">
        <CardTitle class="flex justify-between">
          <PanelTitle class="flex-1" :order="index + 1" :title="item.title" />
          <PanelOperation />
        </CardTitle>
      </CardHeader>
      <CardContent class="px-4 pb-4 h-70">
        <PanelImage :src="item.url" alt="" srcset="" />
      </CardContent>
    </Card>
    <PanelPlus />
  </div>
</template>


<script setup lang="ts">
import { RecordItem } from '~/utils/types';
import { PanelPlus, PanelTitle, PanelImage, PanelOperation } from './index'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';

const props = defineProps({
  recordList: {
    type: Array<RecordItem>,
    default: [],
  },
});
</script>
