
<template>
  <div v-if="props.record">
    <div class="p-4 flex items-center justify-between bg-white rounded-lg shadow-sm mb-4">
      <PanelTitleEdit :title="props.record.title" @update="handleTitleUpdate" />
      <div class="text-sm text-muted-foreground">
        创建于 {{ formatTime(props.record.createdAt) }}
      </div>
    </div>
    <div v-if="props.record.items.length">
      <Card v-for="(item, index) in props.record.items" :key="item.id">
        <CardHeader class="p-4">
          <CardTitle class="flex justify-between">
            <div class="flex-1">{{ item.title }}</div>
            <PanelOperation />
          </CardTitle>
        </CardHeader>
        <CardContent class="px-4 pb-4 h-70">
          <PanelImage :src="item.url" alt="" srcset="" />
        </CardContent>
      </Card>
    </div>
    <div v-else class="text-center text-lg py-8">暂无记录项</div>
  </div>
  <div v-else class="text-center text-lg py-8">暂无数据</div>
</template>


<script setup lang="ts">
import { Record } from '~/utils/types';
import { PanelImage, PanelOperation, PanelTitleEdit } from './index'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { formatTime } from '~/utils/time';

const props = defineProps<{
  record?: Record;
}>();

const emits = defineEmits<{
  (e: 'updateTitle', value: string): void;
}>();

function handleTitleUpdate(value: string) {
  emits('updateTitle', value);
}
</script>
