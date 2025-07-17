<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Record, RecordItem } from '~/utils/types';
import { PanelImage } from '~/components/business/panel';
import CardFooter from '@/components/ui/card/CardFooter.vue';
import { Separator } from '@/components/ui/separator';
import { getRelativeTime } from '~/utils/time';

const props = defineProps<{
  list: Record[];
}>();

const emits = defineEmits<{
  (e: 'select', record: Record): void;
}>();

function findBestRecordItem(items: RecordItem[]) {
  return items.find(item => !!item.url) || items[0]
}

const recordList = computed(() => {
  return props.list.map((record) => {
    const { url, position, size } = findBestRecordItem(record.items)
    return {
      origin: record,
      itemTotal: record.items.length,
      previewUrl: url,
      previewPosition: position,
      previewSize: size
    }
  })
})
</script>

<template>
  <div class="grid grid-cols-1 xl:grid-cols-2 4xl:grid-cols-4 gap-4 py-6" v-if="recordList.length">
    <Card v-for="record in recordList" :key="record.origin.id" class="hover:shadow-md flex flex-col cursor-pointer" @click="emits('select', record.origin)">
      <CardHeader class="p-3">
        <CardTitle class="text-lg font-medium">
          {{ record.origin.title }}
        </CardTitle>
      </CardHeader>
      <CardContent class="p-3 pt-0 flex-1">
        <PanelImage
          :src="record.previewUrl"
          :position="record.previewPosition"
          :size="record.previewSize"
        />
      </CardContent>
      <CardFooter class="p-3">
        <div class="flex h-5 items-center space-x-4 text-sm text-gray-500">
          <span>{{ record.itemTotal }} 条</span>
          <Separator orientation="vertical" />
          <span>{{ getRelativeTime(record.origin.createdAt) }}</span>
        </div>
      </CardFooter>
    </Card>
  </div>
  <div v-else>暂无数据</div>
</template>
