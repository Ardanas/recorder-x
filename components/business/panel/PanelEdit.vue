<script setup lang="ts">
import { Record, RecordItem } from '~/utils/types';
import { PanelImage, PanelOperation, PanelTitleEdit, PanelOrderNumber } from './index'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { getRelativeTime } from '~/utils/time';
import { Button } from '~/components/ui/button';
import { ArrowLeft } from 'lucide-vue-next';
const props = defineProps<{
  record?: Record;
}>();

const emits = defineEmits<{
  (e: 'updateTitle', value: string): void;
  (e: 'updateItemTitle', value: string, item: RecordItem): void;
  (e: 'back'): void;
  (e: 'deleteItem', item: RecordItem): void;
}>();

function handleTitleUpdate(value: string) {
  emits('updateTitle', value);
}

function handleItemTitleUpdate(value: string, item: RecordItem) {
  emits('updateItemTitle', value, item)
}
</script>

<template>
  <div class="px-4 max-w-4xl mx-auto" v-if="props.record">
    <div class="py-4 flex items-center justify-between rounded-lg">
      <Button variant="ghost" class="cursor-pointer" @click="emits('back')">
        <ArrowLeft />
      </Button>
      <PanelTitleEdit class="text-lg font-medium" :title="props.record.title" @update="handleTitleUpdate" />
      <span class="text-sm text-muted-foreground">
        {{ getRelativeTime(props.record.updatedAt) }}
      </span>
    </div>
    <template v-if="props.record.items.length">
      <Card v-for="(item, index) in props.record.items" :key="item.id" class="mb-4">
        <CardHeader class="p-4">
          <CardTitle class="flex items-center gap-2">
            <PanelOrderNumber>{{index + 1}}</PanelOrderNumber>
            <PanelTitleEdit class="flex-1 text-base font-medium" :title="item.title" @update="(value) => handleItemTitleUpdate(value, item)" />
            <PanelOperation @delete="emits('deleteItem', item)"/>
          </CardTitle>
        </CardHeader>
        <CardContent class="px-4 pb-4">
          <PanelImage :src="item.url" :position="item.position" :size="item.size" alt="" srcset="" />
        </CardContent>
      </Card>
    </template>
    <div v-else class="text-center text-lg py-8">暂无记录项</div>
  </div>
  <div v-else class="text-center text-lg py-8">暂无数据</div>
</template>



