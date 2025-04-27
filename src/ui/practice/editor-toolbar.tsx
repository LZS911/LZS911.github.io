import React from 'react';
import Avatar from '../article/avatar';
import { format } from 'date-fns';

interface EditorToolbarProps {
  isAutoSaving: boolean;
  lastSaved: Date | null;
  uploadProgress: string;
  loading: boolean;
  isUploading: boolean;
  isGeneratingPreview: boolean;
  onSaveDraft: () => void;
  onGeneratePreview: () => void;
  onSubmit: () => void;
  onShowDraftList: () => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  isAutoSaving,
  lastSaved,
  uploadProgress,
  loading,
  isUploading,
  isGeneratingPreview,
  onSaveDraft,
  onGeneratePreview,
  onSubmit,
  onShowDraftList
}) => {
  return (
    <div className="flex items-center gap-4">
      {uploadProgress && (
        <span className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
          {uploadProgress}
        </span>
      )}

      <Avatar
        name="Ai.Haibara"
        picture="/assets/blog/authors/haibara_2.jpg"
        height={40}
        width={40}
      />

      <span className="text-sm text-gray-500 dark:text-gray-400">
        {isAutoSaving
          ? '自动保存中...'
          : lastSaved
            ? `上次保存: ${format(lastSaved, 'yyyy-MM-dd HH:mm:ss')}`
            : '尚未保存'}
      </span>

      <button
        onClick={onSaveDraft}
        disabled={loading || isUploading}
        className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        保存草稿
      </button>

      <button
        onClick={onShowDraftList}
        className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-full hover:bg-gray-300 focus:outline-none"
      >
        草稿箱
      </button>

      <button
        onClick={onGeneratePreview}
        disabled={loading || isUploading || isGeneratingPreview}
        className="px-4 py-2 bg-green-500 text-white text-sm rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isGeneratingPreview ? '生成预览中...' : '预览文章'}
      </button>

      <button
        onClick={onSubmit}
        disabled={loading || isUploading}
        className="px-4 py-2 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? '提交中...' : '发布文章'}
      </button>
    </div>
  );
};

export default EditorToolbar;
