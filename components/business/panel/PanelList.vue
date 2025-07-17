<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar';
import { Record } from '~/utils/types';
import { PanelTitleEdit, PanelImage } from '~/components/business/panel';
import CardFooter from '@/components/ui/card/CardFooter.vue';
import { Separator } from '@/components/ui/separator';
import { getRelativeTime } from '~/utils/time';

const props = defineProps<{
  list: Record[];
}>();

const emits = defineEmits<{
  (e: 'select', record: Record): void;
}>();
</script>

<template>
  <div class="grid grid-cols-1 xl:grid-cols-2 4xl:grid-cols-4 gap-4 py-6">
    <Card v-for="record in props.list" :key="record.id" class="hover:shadow-md flex flex-col cursor-pointer" @click="emits('select', record)">
      <CardHeader class="p-3">
        <CardTitle class="text-lg font-medium">
          {{ record.title }}
        </CardTitle>
      </CardHeader>
      <CardContent class="p-3 pt-0 flex-1">
        <PanelImage
          :src="record.items[0].url"
          :position="record.items[0].position"
          :size="record.items[0].size"
        />
      </CardContent>
      <CardFooter class="p-3">
        <div class="flex h-5 items-center space-x-4 text-sm text-gray-500">
          <span>{{ record.items.length }} 条</span>
          <Separator orientation="vertical" />
          <span>{{ getRelativeTime(record.createdAt) }}</span>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>
