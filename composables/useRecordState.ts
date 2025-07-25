import { ref } from 'vue';
import { messaging, RECORD_STATE } from '~/utils';

/**
 * 提供记录状态管理的功能
 */
export function useRecordState() {
  const recordState = ref<RECORD_STATE>(RECORD_STATE.COMPLETE);

  /**
   * 初始化记录状态
   */
  async function initState() {
    const _recordState = await storage.getItem<RECORD_STATE>('local:recordState');
    recordState.value = _recordState || RECORD_STATE.COMPLETE;
    return recordState.value;
  }

  /**
   * 设置记录状态为开始录制
   */
  async function startRecording() {
    recordState.value = RECORD_STATE.START;
    await storage.setItem('local:recordState', RECORD_STATE.START);
    await messaging.sendMessage('start', undefined);
  }

  /**
   * 设置记录状态为暂停录制
   */
  async function pausedRecording() {
    recordState.value = RECORD_STATE.PAUSED;
    await storage.setItem('local:recordState', RECORD_STATE.PAUSED);
    await messaging.sendMessage('paused', undefined);
  }

  /**
   * 设置记录状态为恢复录制
   */
  async function resumeRecording() {
    return startRecording();
  }

  /**
   * 设置记录状态为结束
   */
  async function stopRecording() {
    recordState.value = RECORD_STATE.COMPLETE;
    await storage.setItem('local:recordState', RECORD_STATE.COMPLETE);
  }

  /**
   * 设置记录状态为完成录制
   */
  async function completeRecording() {
    recordState.value = RECORD_STATE.COMPLETE;
    await storage.setItem('local:recordState', RECORD_STATE.COMPLETE);
  }

  return {
    recordState,
    initState,
    startRecording,
    pausedRecording,
    stopRecording,
    resumeRecording,
    completeRecording
  };
}