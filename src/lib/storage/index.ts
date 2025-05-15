import { getStorageSystem } from './storage-factory';

const storageSystem = getStorageSystem();

export const initializeStorage = () => storageSystem.initialize();
export const startCleanupScheduler = (intervalMs?: number) =>
  storageSystem.startCleanupScheduler(intervalMs);
export const stopCleanupScheduler = () => storageSystem.stopCleanupScheduler();
export const getCleanupSchedulerStatus = () =>
  storageSystem.getCleanupSchedulerStatus();
export const savePreviewContent = (
  previewId: string,
  html: string,
  expireSeconds?: number
) => storageSystem.savePreviewContent(previewId, html, expireSeconds);
export const getPreviewContent = (previewId: string) =>
  storageSystem.getPreviewContent(previewId);
export const saveTemporaryImage = (
  imageId: string,
  content: Buffer,
  expireSeconds?: number
) => storageSystem.saveTemporaryImage(imageId, content, expireSeconds);
export const getTemporaryImage = (imageId: string) =>
  storageSystem.getTemporaryImage(imageId);
export const cleanupExpiredFiles = () => storageSystem.cleanupExpiredFiles();
