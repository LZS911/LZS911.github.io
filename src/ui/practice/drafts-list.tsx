import { format } from 'date-fns';
import React from 'react';

interface Draft {
  id: string;
  title: string;
  lastSaved: string;
}

interface DraftsListProps {
  drafts: Draft[];
  currentArticleId: string;
  showDraftList: boolean;
  onClose: () => void;
  onSwitchDraft: (draftId: string) => void;
  onDeleteDraft: (draftId: string) => void;
  onCreateNewDraft: () => void;
}

const DraftsList: React.FC<DraftsListProps> = ({
  drafts,
  currentArticleId,
  showDraftList,
  onClose,
  onSwitchDraft,
  onDeleteDraft,
  onCreateNewDraft
}) => {
  if (!showDraftList) return null;

  return (
    <div className="fixed top-16 right-6 bg-white dark:bg-gray-800 shadow-xl rounded-lg p-4 z-20 border border-gray-200 dark:border-gray-700 w-80">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold">我的草稿</h3>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ×
        </button>
      </div>

      {drafts.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          没有保存的草稿
        </p>
      ) : (
        <ul className="space-y-2 max-h-80 overflow-y-auto">
          {drafts.map((draft) => (
            <li
              key={draft.id}
              className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex justify-between ${draft.id === currentArticleId ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
            >
              <div className="flex-1">
                <p className="font-medium truncate max-w-[200px]">
                  {draft.title || '无标题草稿'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {draft.lastSaved
                    ? format(new Date(draft.lastSaved), 'yyyy-MM-dd HH:mm:ss')
                    : '未知时间'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {draft.id !== currentArticleId && (
                  <button
                    onClick={() => onSwitchDraft(draft.id)}
                    className="text-blue-500 hover:text-blue-600 text-sm"
                  >
                    切换
                  </button>
                )}
                <button
                  onClick={() => onDeleteDraft(draft.id)}
                  className="text-red-500 hover:text-red-600 text-sm"
                >
                  删除
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={onCreateNewDraft}
        className="w-full mt-3 px-4 py-2 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600"
      >
        创建新草稿
      </button>
    </div>
  );
};

export default DraftsList;
