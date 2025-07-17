import { messaging } from '~/utils';

export default defineBackground(() => {
  console.log('Hello background!', { id: browser.runtime.id });

  messaging.onMessage('capture', async ({ data }) => {
    const base64 = await browser.tabs.captureVisibleTab();
    const message = { ...(data || {}), screenshot: base64 };
    return messaging.sendMessage('captureDone', message);
  });

  messaging.onMessage('start', async () => {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    return messaging.sendMessage('start', undefined, tabs[0].id);
  });

  messaging.onMessage('paused', async () => {
    const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    return messaging.sendMessage('paused', undefined, tabs[0].id);
  });
});
