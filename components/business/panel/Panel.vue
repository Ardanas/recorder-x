<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { PanelTitle, PanelImage } from '~/components/business/panel';
import { Record } from '~/utils/types';
import { formatTime } from '~/utils/time';

const props = defineProps<{
  record: Record
}>();

const emits = defineEmits(['complete', 'stop', 'updateTitle']);

const isEditing = ref(false);
const editingTitle = ref('');

function startEdit() {
  editingTitle.value = props.record.title;
  isEditing.value = true;
}

function handleBlur() {
  if (editingTitle.value !== props.record.title) {
    emits('updateTitle', editingTitle.value);
  }
  isEditing.value = false;
}
</script>

<template>
  <div class="w-full h-full overflow-hidden flex flex-col gap-4">
    <header class="p-4 border-b">
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <div v-if="!isEditing" @click="startEdit" class="text-xl font-bold cursor-pointer hover:text-primary">
            {{ props.record.title }}
          </div>
          <input
            v-else
            v-model="editingTitle"
            @blur="handleBlur"
            type="text"
            class="w-full text-xl font-bold border-b focus:outline-none focus:border-primary"
            ref="titleInput"
          />
        </div>
        <div class="text-sm text-gray-500">
          创建于 {{ formatTime(props.record.createdAt) }}
        </div>
      </div>
    </header>
    <main class="flex-1 p-2 overflow-auto">
      <Card class="shadow-none" v-for="(item, index) in props.record.items" :key="item.id">
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
    <footer class="flex-shrink-0 border-t p-2">
      <Button variant="outline" class="cursor-pointer" @click="emits('stop')">暂停录制</Button>
      <div class="mt-2">
        <Button class="w-full cursor-pointer" @click="emits('complete')">完成录制</Button>
      </div>
    </footer>
  </div>
</template>
