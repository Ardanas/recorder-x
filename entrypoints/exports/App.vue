<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Record, RecordMap } from '~/utils/types';
import { formatTime, getCurrentTime } from '~/utils/time';
import { Button } from '~/components/ui/button';
import { browser } from 'wxt/browser';
import PizZipUtils from 'pizzip/utils/index.js';
import { saveAs } from 'file-saver';
import { Loader2 } from 'lucide-vue-next';

const currentRecord = ref<Record>();
const params = new URLSearchParams(window.location.search);
const mapKey = params.get('mapKey');
const exportType = params.get('type');
const isExporting = ref(false);

function close() {
  window.close();
}

function base64DataURLToArrayBuffer(dataURL: string) {
  const base64Regex = /^data:image\/(png|jpg|svg|svg\+xml);base64,/;
  if (!base64Regex.test(dataURL)) {
    return false;
  }
  const stringBase64 = dataURL.replace(base64Regex, '');
  let binaryString;
  if (typeof window !== 'undefined') {
    binaryString = window.atob(stringBase64);
  } else {
    binaryString = Buffer.from(stringBase64, 'base64').toString('binary');
  }
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    const ascii = binaryString.charCodeAt(i);
    bytes[i] = ascii;
  }
  return bytes;
}

async function exportToWord() {
  if (!currentRecord.value) return;
  isExporting.value = true;

  // 准备数据
  const data = {
    title: currentRecord.value.title,
    createdAt: formatTime(currentRecord.value.createdAt),
    updatedAt: formatTime(currentRecord.value.updatedAt),
    items: currentRecord.value.items.map((item, index) => ({
      title: `${index + 1}.${item.title}`,
      url: item.url,
      createdAt: formatTime(item.createdAt),
      updatedAt: formatTime(item.updatedAt),
    })),
  };
  const templateUrl = browser.runtime.getURL('/templates/record.docx');
  try {
    PizZipUtils.getBinaryContent(templateUrl, async (error, content) => {
      if (error) throw error;
      const Docxtemplater = (await import('docxtemplater')).default;
      // @ts-ignore
      const DocxtemplaterImageModule = (await import('docxtemplater-image-module-free')).default;
      const PizZip = (await import('pizzip')).default;

      const imageModule = new DocxtemplaterImageModule({
        centered: false,
        getImage(base64: string) {
          return base64DataURLToArrayBuffer(base64);
        },
        async getSize(_img: ArrayBuffer, tagValue: string, _tagName: string) {
          const { width, height } = await getImageProperties(tagValue, 600);
          return [width, height];
        },
      });
      // 生成文档
      const zip = new PizZip(content);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        modules: [imageModule],
      });

      await doc.renderAsync(data);

      // 下载文件
      const blob = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      saveAs(blob, `${data.title}.docx`);
    });
  } catch (error) {
    console.error('导出Word文档失败:', error);
    alert('导出失败，请稍后重试');
  } finally {
    isExporting.value = false;
    close();
  }
}

interface ImageSize {
  width: number;
  height: number;
}

function getImageProperties(url: string, forceWidth?: number): Promise<ImageSize> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (forceWidth) {
        const ratio = forceWidth / img.width;
        resolve({
          width: forceWidth,
          height: Math.round(img.height * ratio)
        });
      } else {
        resolve({
          width: img.width,
          height: img.height
        });
      }
    };
    img.onerror = (e) => {
      reject(e);
    };
    img.src = url;
  });
}

async function exportToPdf() {
  if (!currentRecord.value) return;
  isExporting.value = true;
  try {
    const { jsPDF } = await import('jspdf');
    // 创建 PDF 时启用中文支持
    const doc = new jsPDF({
      orientation: 'p',
      unit: 'pt',
      format: 'a4',
      putOnlyUsedFonts: true
    });

    // 添加中文字体
    doc.addFont('https://cdn.jsdelivr.net/npm/@fontsource/noto-sans-sc@5.0.17/files/noto-sans-sc-chinese-simplified-400-normal.woff', 'NotoSansSC', 'normal');
    doc.setFont('NotoSansSC');

    // 添加标题
    doc.setFontSize(24);
    doc.text(currentRecord.value.title, 40, 40);

    // 添加时间信息
    doc.setFontSize(14);
    doc.text(`创建时间：${formatTime(currentRecord.value.createdAt)}`, 40, 70);
    doc.text(`更新时间：${formatTime(currentRecord.value.updatedAt)}`, 40, 90);

    // 添加记录项
    doc.setFontSize(16);
    let y = 130;
    for (const [index, item] of currentRecord.value.items.entries()) {
      if (y > 750) {
        // 如果接近页面底部，添加新页
        doc.addPage();
        y = 40;
      }
      doc.text(`${index + 1}. ${item.title}`, 40, y);
      y += 25;

      // 添加图片
      try {
        const arrayBuffer = base64DataURLToArrayBuffer(item.url);
        if (arrayBuffer) {
          const { width, height } = await getImageProperties(item.url, 300);
          if (y + height > 750) {
            doc.addPage();
            y = 40;
          }
          doc.addImage(arrayBuffer, 'JPEG', 60, y, width, height, undefined, 'FAST');
          y += height + 30;
        }
      } catch (e) {
        console.warn('图片处理失败:', e);
      }
    }

    // 下载文件
    doc.save(`${currentRecord.value.title}_${formatTime(getCurrentTime())}.pdf`);
  } catch (error) {
    console.error('导出PDF失败:', error);
    alert('导出失败，请稍后重试');
  } finally {
    isExporting.value = false;
    close();
  }
}

onMounted(() => {
  if (!mapKey) return;
  storage.getItem<RecordMap>('local:dataMap').then((res) => {
    if (!res) return;
    currentRecord.value = res[mapKey];
    if (exportType === 'pdf') {
      exportToPdf();
    } else if (exportType === 'word') {
      exportToWord();
    }
  });
});
</script>

<template>
  <div class="flex min-h-screen items-center justify-center">
    <div class="text-center">
      <div class="mb-4 text-lg">正在导出文件，请稍候...</div>
      <Button disabled>
        <Loader2 class="w-4 h-4 animate-spin" />
        导出中
      </Button>
    </div>
  </div>
</template>
