<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '~/components/ui/button';
// import Logo from '~/components/Logo.vue';

const props = defineProps<{
  currentKey?: string | null;
}>();

const emits = defineEmits(['download', 'delete', 'show-history']);

const historyList = ref<{ key: string; time: string }[]>([]);

// 加载历史数据列表
storage.getItem<Record<string, any>>('local:dataMap').then((res) => {
  if (!res) return;
  historyList.value = Object.keys(res).map((key) => ({
    key,
    time: new Date(Number(key)).toLocaleString(),
  })).sort((a, b) => Number(b.key) - Number(a.key));
});
</script>

<template>
  <header class="flex items-center justify-between px-4 h-16 border-b bg-background/80 backdrop-blur">
    <div class="flex items-center gap-2">
      <!-- <Logo class="w-8 h-8" /> -->
      <!-- LOGO -->
      <span class="font-bold text-xl tracking-wide">RecordX</span>
    </div>
    <div class="flex items-center gap-2">
      <Button variant="outline" class="px-4" @click="() => emits('show-history', historyList)">历史记录</Button>
      <Button @click="() => emits('download')">导出</Button>
      <Button variant="destructive" @click="() => emits('delete')">删除</Button>
    </div>
  </header>
</template>