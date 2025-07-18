<script setup lang="ts">
import { ref, inject } from 'vue';
import { Button } from '~/components/ui/button';
import { Empty } from '~/components/ui/empty';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { PanelImage, PanelOperation, PanelTitleEdit, PanelOrderNumber } from './index';
import { Record, RECORD_STATE } from '~/utils/types';
import { getRelativeTime } from '~/utils/time';
import { CirclePause, CircleStop, CircleCheck, StepForward } from 'lucide-vue-next';

const props = defineProps<{
  record: Record;
}>();

const recordState = inject<RECORD_STATE>('recordState', RECORD_STATE.START);

const emits = defineEmits(['complete', 'stop', 'paused', 'resume', 'updateTitle', 'updateItemTitle', 'deleteItem']);

function handleTitleUpdate(value: string) {
  emits('updateTitle', value);
}

function handleItemTitleUpdate(value: string, item: RecordItem) {
  emits('updateItemTitle', value, item);
}

const mainRef = useTemplateRef('mainRef');
watch(
  () => props.record.items.length,
  (newValue, oldValue) => {
    if (oldValue && newValue > oldValue) {
      setTimeout(() => {
        mainRef.value?.scrollTo({
          top: mainRef.value.scrollHeight,
          behavior: 'smooth',
        });
      }, 0);
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="w-full h-full overflow-hidden flex flex-col gap-2">
    <header class="p-4 border-b flex items-center justify-between">
      <PanelTitleEdit class="flex-1 text-lg font-medium" :title="props.record.title" @update="handleTitleUpdate" />
      <div class="text-sm text-gray-500">{{ getRelativeTime(props.record.updatedAt) }}</div>
    </header>
    <main class="flex-1 p-2 overflow-auto" ref="mainRef">
      <template v-if="props.record.items.length">
        <Card class="shadow-none border-none mb-4" v-for="(item, index) in props.record.items" :key="item.id">
          <CardHeader class="p-2">
            <CardTitle class="flex items-center gap-2">
              <PanelOrderNumber>{{ index + 1 }}</PanelOrderNumber>
              <PanelTitleEdit
                class="flex-1 text-base font-medium"
                :title="item.title"
                @update="(value) => handleItemTitleUpdate(value, item)"
              />
              <PanelOperation @delete="emits('deleteItem', item)" />
            </CardTitle>
          </CardHeader>
          <CardContent class="p-2 pt-0 flex-1">
            <PanelImage :src="item.url" :position="item.position" :size="item.size" alt="" srcset="" />
          </CardContent>
        </Card>
      </template>
      <Empty description="暂无数据，点击页面即可录制~" v-else />
    </main>
    <footer class="flex-shrink-0 border-t p-2">
      <div class="flex justify-between">
        <Button
          variant="outline"
          class="cursor-pointer"
          @click="emits(recordState === RECORD_STATE.PAUSED ? 'resume' : 'paused')"
        >
          <CirclePause v-if="recordState === RECORD_STATE.PAUSED" />
          <StepForward v-else />
          {{ recordState === RECORD_STATE.PAUSED ? '恢复录制' : '暂停录制' }}
        </Button>
        <Button variant="destructive" @click="emits('stop')">
          <CircleStop class="size-4" />
          结束录制
        </Button>
      </div>
      <div class="mt-2">
        <Button class="w-full cursor-pointer" :disabled="props.record.items.length === 0" @click="emits('complete')">
          <CircleCheck class="size-4" />
          完成录制
        </Button>
      </div>
    </footer>
  </div>
</template>
