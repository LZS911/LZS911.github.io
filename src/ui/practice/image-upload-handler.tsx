import { useState, useCallback } from 'react';

interface UseImageUploadHandlerResult {
  isUploading: boolean;
  uploadProgress: string;
  setUploadProgress: (message: string) => void;
  clearUploadProgress: () => void;
}

/**
 * 图片上传处理钩子
 * 用于管理图片上传状态
 */
export function useImageUploadHandler(): UseImageUploadHandlerResult {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgressState] = useState('');

  // 设置上传进度消息，并在一段时间后自动清除
  const setUploadProgress = useCallback(
    (message: string, autoHideTime = 3000) => {
      setUploadProgressState(message);

      if (message.includes('上传中')) {
        setIsUploading(true);
      } else {
        setIsUploading(false);

        if (autoHideTime > 0) {
          setTimeout(() => {
            setUploadProgressState('');
          }, autoHideTime);
        }
      }
    },
    []
  );

  // 手动清除上传进度消息
  const clearUploadProgress = useCallback(() => {
    setUploadProgressState('');
    setIsUploading(false);
  }, []);

  return {
    isUploading,
    uploadProgress,
    setUploadProgress,
    clearUploadProgress
  };
}
