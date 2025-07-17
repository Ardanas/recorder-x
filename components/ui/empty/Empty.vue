<script setup lang="ts">
const props = defineProps<{
  description?: string;
  class?: string;
}>();
</script>

<template>
  <div
    class="flex justify-center items-center text-base text-gray-500 py-8"
    :class="props.class"
  >
    {{ props.description || '暂无数据' }}
  </div>
</template>