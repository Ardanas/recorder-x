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
    left: `${markerPositionTemp.value.x}px`,
    transform: 'translate(-50%, -50%)',
  };
});

// 监听图片加载完成并计算背景位置
async function calculatePosition() {
  if (!imageBoxRef.value) return;
  const { width } = imageBoxRef.value.getBoundingClientRect();
  imageHeight.value = (width * props.size.height) / props.size.width;
  const x = (width * props.position.x) / props.size.width;
  const y = (imageHeight.value * props.position.y) / props.size.height;
  markerPositionTemp.value.x = x;
  markerPositionTemp.value.y = y;
}


onMounted(async () => {
  nextTick(() => {
    calculatePosition();

    window.addEventListener('resize', calculatePosition);
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', calculatePosition);
});
</script>
<template>
  <div class="w-full p-1 bg-[#f1f5f9] rounded-lg">
    <div :style="{ height: `${imageHeight}px` }" class="relative" ref="imageBoxRef">
      <img v-bind="$attrs" class="rounded-md w-full h-full" />
      <div
        class="cursor-pointer transition-transform origin-center hover:scale-125 absolute left-0 top-0 size-11 overflow-hidden rounded-full border-2 duration-300 will-change-[translate]"
        style="border-color: rgba(251, 146, 60, 0.75); background-color: rgba(251, 146, 60, 0.498);"
        :style="markerStyle"
      />
    </div>
  </div>
</template>
