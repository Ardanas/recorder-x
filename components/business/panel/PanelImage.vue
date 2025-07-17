<script setup lang="ts">
import { nextTick, ref, onMounted, onUnmounted, watch, computed } from 'vue';
interface Position {
  x: number;
  y: number;
}
interface Size {
  width: number;
  height: number;
}

const props = defineProps({
  src: {
    type: String,
    default: '',
  },
  position: {
    type: Object as () => Position,
    required: true,
  },
  size: {
    type: Object as () => Size,
    required: true,
  },
});

const imageBoxRef = useTemplateRef('imageBoxRef');
const markerPositionTemp = ref({ x: -100, y: -100 });
const imageHeight = ref(0);

const markerStyle = computed(() => {
  return {
    top: `${markerPositionTemp.value.y}px`,
    left: `${markerPositionTemp.value.x}px`
  };
});

// 监听图片加载完成并计算背景位置
async function calculatePosition() {
  if (!imageBoxRef.value || !props.src) return;
  const { width } = imageBoxRef.value.getBoundingClientRect();
  imageHeight.value = (width * props.size.height) / props.size.width;
  const x = (width * props.position.x) / props.size.width;
  const y = (imageHeight.value * props.position.y) / props.size.height;
  markerPositionTemp.value.x = x;
  markerPositionTemp.value.y = y;
}

onMounted(async () => {
  nextTick(async () => {
    await calculatePosition();

    window.addEventListener('resize', calculatePosition);
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', calculatePosition);
});
</script>
<template>
  <div class="w-full p-1 bg-[#f1f5f9] rounded-lg group" v-if="props.src">
    <div :style="{ height: `${imageHeight}px` }" class="relative" ref="imageBoxRef">
      <img :src="props.src" v-bind="$attrs" class="rounded-md w-full h-full" />
      <div
        class="cursor-pointer transition-transform transform -translate-x-1/2 -translate-y-1/2 group-hover:scale-125 absolute size-11 overflow-hidden rounded-full border-2 duration-300 will-change-[translate]"
        style="border-color: rgba(251, 146, 60, 0.75); background-color: rgba(251, 146, 60, 0.498)"
        :style="markerStyle"
      />
    </div>
  </div>
  <div v-else class="size-full min-h-[100px] flex justify-center items-center bg-[#f1f5f9] rounded-lg text-base">无图</div>
</template>
