import { messaging } from '@/messaging';
import { RECORD_STATE } from '~/utils/types';

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_end',
  allFrames: false,
  main(ctx) {
    let recording = false;

    async function init() {
      const res = await storage.getItem<RECORD_STATE>('local:recordState');
      if (res === RECORD_STATE.START) {
        startRecording();
      }
    }

    init();

    function getClickTypeAndText(event: MouseEvent) {
      const el = event.target;
      if (!el || !(el instanceof HTMLElement)) return;
      if (el.tagName === 'IMG') {
        return { type: 'image', text: '点击了图片' };
      } else if (el.tagName === 'A') {
        const anchor = el as HTMLAnchorElement;
        let linkText = anchor.innerText.trim();
        if (!linkText) linkText = anchor.href;
        return { type: 'link', text: `点击了${linkText}链接` };
      } else if (el.innerText && el.innerText.trim()) {
        return { type: 'text', text: `点击了${el.innerText.trim().slice(0, 20)}` };
      } else {
        return { type: 'other', text: '点击了其他元素' };
      }
    }

    function sendOperation(event: MouseEvent) {
      const result = getClickTypeAndText(event);
      if (!result) return;
      const { type, text } = result;
      console.log('capture==');
      messaging.sendMessage('capture', {
        type,
        text,
        clientX: event.clientX,
        clientY: event.clientY,
        imageWidth: document.documentElement.clientWidth,
        imageHeight: document.documentElement.clientHeight,
        devicePixelRatio: window.devicePixelRatio,
      });
    }

    function startRecording() {
      if (recording) return;
      document.addEventListener('click', sendOperation, true);
      recording = true;
    }

    function stopRecording() {
      if (!recording) return;
      document.removeEventListener('click', sendOperation, true);
      recording = false;
    }

    messaging.onMessage('start', () => {
      console.log('start===');
      startRecording();
    });

    messaging.onMessage('stop', () => {
      console.log('stop===');

      stopRecording();
    });
  },
});
