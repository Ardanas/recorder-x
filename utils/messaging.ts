import { defineExtensionMessaging } from '@webext-core/messaging';

interface ProtocolMap {
  start(): void;
  paused(): void;
  capture(s: any): void;
  captureDone(o: Record<string, any>): void
}

export const messaging = defineExtensionMessaging<ProtocolMap>();