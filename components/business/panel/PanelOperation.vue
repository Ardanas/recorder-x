<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <Button variant="ghost" class=cursor-pointer>
        <EllipsisVertical class="size-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem @click="emits('delete')">
        <Trash2 class="size-4" /> 删除
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { Button } from '~/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '~/components/ui/dropdown-menu';

import { Trash2, EllipsisVertical } from 'lucide-vue-next';

const emits = defineEmits(['delete'])
</script>
