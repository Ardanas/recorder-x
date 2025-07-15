<template>
  <div class="size-full flex flex-col gap-4 justify-center items-center">
    <a href="#" target="_blank">
      <img src="/wxt.svg" class="logo" alt="WXT logo" />
    </a>
    <div class="text-2xl font-bold">RecorderX</div>
    <Button @click="emits('start')" class="cursor-pointer w-80"> 开始录制 </Button>
    <Button variant="secondary" @click="emits('my')" class="cursor-pointer w-80"> 我的 </Button>
  </div>
</template>

<script setup lang="ts">
import { Button } from '~/components/ui/button';
const emits = defineEmits(['start', 'my'])
</script>


<style scoped>
.logo {
  will-change: filter;
  transition: filter 300ms;
  filter: drop-shadow(0 0 2em #54bc4ae0);
}
</style>