<script setup lang="ts">
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { PanelTitle, PanelImage } from '~/components/business/panel';
import { RecordItem } from '~/utils/types';

const props = defineProps({
  recordList: {
    type: Array<RecordItem>,
    default: [],
  },
});

const emits = defineEmits(['complete', 'stop']);
</script>

<template>
  <div class="w-full h-full overflow-hidden flex flex-col gap-4">
    <main class="flex-1 p-2 overflow-auto">
      <Card class="shadow-none" v-for="(item, index) in props.recordList" :key="index">
        <CardHeader class="p-4">
          <CardTitle>
            <PanelTitle :order="index + 1" :title="item.title" />
          </CardTitle>
        </CardHeader>
        <CardContent class="px-4 pb-4">
          <PanelImage :src="item.url" alt="" srcset="" />
        </CardContent>
      </Card>
    </main>
    <footer class="flex-shrink-0 border-t-1 p-2">
      <Button variant="outline" class="cursor-pointer" @click="emits('stop')">暂停录制</Button>
      <div class="mt-2">
        <Button class="w-full cursor-pointer" @click="emits('complete')">完成录制</Button>
      </div>
    </footer>
  </div>
</template>
