<script setup lang="ts">
import { Button } from '~/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '~/components/ui/dropdown-menu';

const emits = defineEmits(['download', 'delete', 'show-history']);
const props = defineProps({
  showExport: {
    type: Boolean,
    default: false,
  }
});
</script>

<template>
  <header class="flex items-center justify-between px-4 h-16 border-b bg-background/80 backdrop-blur">
    <div class="flex items-center gap-2">
      <!-- <Logo class="w-8 h-8" /> -->
      <!-- LOGO -->
      <span class="font-bold text-xl tracking-wide">RecorderX</span>
    </div>
    <div class="flex items-center gap-2">
      <DropdownMenu v-if="props.showExport">
        <DropdownMenuTrigger>
          <Button>导出</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>导出格式</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="emits('download', 'pdf')">PDF</DropdownMenuItem>
          <DropdownMenuItem @click="emits('download', 'word')">Word</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="outline" class="px-4" @click="emits('show-history')">我的</Button>
      <!-- <Button variant="destructive" @click="() => emits('delete')">删除</Button> -->
    </div>
  </header>
</template>