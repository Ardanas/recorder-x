<script setup lang="ts">
import { Card, CardContent } from '~/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar';
import { Record } from '~/utils/types';
import { PanelTitleEdit, PanelImage } from '~/components/business/panel';
import CardFooter from '@/components/ui/card/CardFooter.vue';
import { Separator } from '@/components/ui/separator';
import { formatTime } from '~/utils/time';

const props = defineProps<{
  list: Record[];
}>();

const emits = defineEmits<{
  (e: 'select', record: Record): void;
}>();

</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 p-4">
    <Card v-for="record in props.list" :key="record.id" class="hover:shadow-md">
      <CardContent class="p-3">
        <div class="mb-2">
          <PanelTitleEdit :title="record.title" />
        </div>
        <Avatar
          class="w-full h-50 bg-slate-100 rounded-md cursor-pointer"
          @click="emits('select', record)"
        >
          <PanelImage
            v-if="record.items.length && record.items[0].url"
            :src="record.items[0].url"
          />
          <AvatarFallback v-else>无图</AvatarFallback>
        </Avatar>
      </CardContent>
      <CardFooter>
        <div class="flex h-5 items-center space-x-4 text-sm">
          <div>{{ record.items.length }} 条</div>
          <Separator orientation="vertical" />
          <div>{{ formatTime(record.createdAt) }}</div>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>
