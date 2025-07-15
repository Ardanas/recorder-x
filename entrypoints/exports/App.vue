<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Record, RecordMap } from '~/utils/types';
import { formatTime, getCurrentTime } from '~/utils/time';
import { Button } from '~/components/ui/button';
import { browser } from 'wxt/browser';
import PizZipUtils from 'pizzip/utils/index.js';
import { saveAs } from 'file-saver';

const currentRecord = ref<Record>();
const params = new URLSearchParams(window.location.search);
const mapKey = params.get('mapKey');
const exportType = params.get('type');
const isExporting = ref(false);

function close() {
  window.close()
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
  return bytes.buffer;
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
        getSize(_img: ArrayBuffer, tagValue: string, _tagName: string) {
          return new Promise((resolve, reject) => {
            const image = new Image();
            image.src = tagValue;
            image.onload = () => {
              const forceWidth = 600;
              const ratio = forceWidth / image.width;
              resolve([forceWidth, Math.round(image.height * ratio)]);
            };
            image.onerror = (e) => {
              reject(e);
            };
          });
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

async function exportToPdf() {
  if (!currentRecord.value) return;
  isExporting.value = true;
  try {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();

    // 设置中文字体
    // const font = await fetch('/fonts/NotoSansSC-Regular.ttf');
    // const fontData = await font.arrayBuffer();
    // doc.addFont(fontData, 'NotoSansSC', 'normal');
    // doc.setFont('NotoSansSC');

    // 添加标题
    doc.setFontSize(20);
    doc.text(currentRecord.value.title, 20, 20);

    // 添加时间信息
    doc.setFontSize(12);
    doc.text(`创建时间：${formatTime(currentRecord.value.createdAt)}`, 20, 30);
    doc.text(`更新时间：${formatTime(currentRecord.value.updatedAt)}`, 20, 40);

    // 添加记录项
    doc.setFontSize(14);
    let y = 60;
    currentRecord.value.items.forEach((item, index) => {
      if (y > 270) {
        // 如果接近页面底部，添加新页
        doc.addPage();
        y = 20;
      }
      doc.text(`${index + 1}. ${item.title}`, 20, y);
      y += 10;
      doc.setFontSize(10);
      doc.text(`URL: ${item.url}`, 30, y);
      y += 8;
      doc.text(`创建：${formatTime(item.createdAt)}`, 30, y);
      y += 8;
      doc.text(`更新：${formatTime(item.updatedAt)}`, 30, y);
      y += 15;
      doc.setFontSize(14);
    });

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
  browser.storage.local.get('dataMap').then((result: { dataMap?: RecordMap }) => {
    const res = result.dataMap;
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
        <div class="i-lucide-loader-2 mr-2 h-4 w-4 animate-spin" />
        导出中
      </Button>
    </div>
  </div>
</template>
