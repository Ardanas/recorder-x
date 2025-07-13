<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Card, CardContent } from '~/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar';

const props = defineProps<{
  list: { key: string; time: string }[];
  currentKey?: string | null;
}>();
const emits = defineEmits(['select']);

const activeKey = computed(() => props.currentKey);

const historyMeta = ref(props.list.map(item => ({ ...item, title: '', url: '' })));

onMounted(async () => {
  const res = await storage.getItem<Record<string, any>>('local:dataMap');
  if (!res) return;
  historyMeta.value = props.list.map(item => {
    const arr = res[item.key] || [];
    return {
      ...item,
      title: arr[0]?.title || '',
      url: arr[0]?.url || '',
    };
  });
});
</script>

<template>
  <div class="flex gap-2 overflow-x-auto">
    <Card
      v-for="item in historyMeta"
      :key="item.key"
      :class="[
        'min-w-[180px] flex-shrink-0 flex flex-col items-center justify-between transition-shadow',
        activeKey === item.key ? 'ring-2 ring-primary border-primary' : 'border-border',
        'hover:shadow-md',
      ]"
    >
      <CardContent class="flex flex-col items-center p-3">
        <Avatar class="mb-2 w-10 h-10">
          <AvatarImage v-if="item.url" :src="item.url" />
          <AvatarFallback v-else>无图</AvatarFallback>
        </Avatar>
        <div class="font-medium text-sm text-center line-clamp-1 w-32">{{ item.title || '无标题' }}</div>
        <div class="text-xs text-muted-foreground mt-1">{{ item.time }}</div>
        <button
          class="mt-2 px-3 py-1 rounded bg-accent text-accent-foreground text-xs font-semibold border border-accent hover:bg-primary hover:text-primary-foreground transition-colors"
          :class="activeKey === item.key ? 'bg-primary text-primary-foreground' : ''"
          @click="() => emits('select', item.key)"
        >
          查看
        </button>
      </CardContent>
    </Card>
  </div>
</template>
