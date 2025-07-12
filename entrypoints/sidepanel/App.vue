<script lang="ts" setup>
import { ref, watch } from 'vue';
import { Panel } from '~/components/business/panel';
import Welcome from '~/components/business/Welcome.vue';
import { messaging } from '~/messaging';
import { storage } from '#imports';
import { RecordItem } from '~/utils/types';

const isRecording = ref(false);
const recordList = ref<RecordItem[]>([]);

storage.getItem<boolean>('local:isRecording').then((res) => {
  isRecording.value = !!res;
});

storage.getItem<RecordItem[]>('local:recordList').then((res) => {
  recordList.value = res || [];
});

watch(isRecording, async (newValue) => {
  if (newValue) {
    messaging.sendMessage('start', undefined);
  } else {
    messaging.sendMessage('stop', undefined);
  }
  storage.setItem<boolean>('local:isRecording', newValue);
});

async function addRedCircleToImage(
  base64: string,
  clientX: number,
  clientY: number,
  devicePixelRatio: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    // 创建图像对象
    const img = new Image();
    img.onload = () => {
      // 创建canvas元素
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      // 设置canvas尺寸与图像相同
      canvas.width = img.width;
      canvas.height = img.height;

      // 绘制原始图像
      ctx.drawImage(img, 0, 0);

      // 计算圆形位置和大小（考虑设备像素比）
      const circleSize = 30 * devicePixelRatio;
      const x = clientX * devicePixelRatio - circleSize / 2;
      const y = clientY * devicePixelRatio - circleSize / 2;

      // 绘制红色圆形
      ctx.beginPath();
      ctx.arc(
        x + circleSize / 2, // 中心x坐标
        y + circleSize / 2, // 中心y坐标
        circleSize / 2, // 半径
        0, // 起始角度
        Math.PI * 2 // 结束角度
      );
      ctx.fillStyle = 'red';
      ctx.fill();

      // 将canvas转换为base64图像
      const newBase64 = canvas.toDataURL('image/png');
      resolve(newBase64);
    };

    img.onerror = function () {
      reject(new Error('Failed to load image'));
    };

    // 设置图像源
    img.src = base64;
  });
}

messaging.onMessage('capture', async ({ data }) => {
  const info: RecordItem = {
    title: data.text,
    url: await addRedCircleToImage(data.screenshot, data.clientX, data.clientY, data.devicePixelRatio),
    date: new Date().toLocaleTimeString(),
  };
  recordList.value.push(info);
  storage.setItem('local:recordList', recordList.value);
});

function start() {
  isRecording.value = true;
}

function stop() {
  isRecording.value = false;
}

function complete() {
  isRecording.value = false;
  const list = toRaw(recordList.value);
  recordList.value = [];
  const key = Date.now();
  storage.setItem('local:recordList', []);

  storage.getItem<Record<string, RecordItem[]>>('local:dataMap').then((res) => {
    storage.setItem('local:dataMap', {
      ...res,
      [key]: list,
    });
    const url = browser.runtime.getURL(`/panel-edit.html?mapKey=${key}`);
    window.open(url); // Open the page in a new tab
  });
}
</script>

<template>
  <div class="w-screen h-screen">
    <Welcome @start="start" v-if="!isRecording" />
    <Panel :record-list="recordList" @stop="stop" @complete="complete" v-else />
  </div>
</template>
