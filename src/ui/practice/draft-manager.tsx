import { useState, useCallback, useEffect, useRef } from 'react';
import LZString from 'lz-string';
import PostType from '../../types/post';
import { type Theme } from '@/types/theme';
import { THEMES } from '@/lib/theme';

// 持久化存储的草稿类型
export interface DraftData {
  title: string;
  content: string;
  category: PostType['category'];
  theme: Theme;
  lastSaved: string;
}

export interface Draft {
  id: string;
  title: string;
  lastSaved: string;
}

interface UseDraftManagerProps {
  articleId: string;
  title: string;
  content: string;
  category: PostType['category'];
  theme: Theme;
  onUpdateTitle: (value: string) => void;
  onUpdateContent: (value: string) => void;
  onUpdateCategory: (value: PostType['category']) => void;
  onUpdateTheme: (value: Theme) => void;
}

interface UseDraftManagerResult {
  isAutoSaving: boolean;
  lastSaved: Date | null;
  saveDraft: () => void;
  drafts: Draft[];
  loadAllDrafts: () => void;
  switchToDraft: (draftId: string) => void;
  deleteDraft: (draftId: string) => void;
  createNewDraft: () => void;
  lastContentRef: React.RefObject<Omit<DraftData, 'lastSaved'>>;
}

/**
 * 草稿管理器 Hook
 */
export function useDraftManager({
  articleId,
  title,
  content,
  category,
  theme,
  onUpdateTitle,
  onUpdateContent,
  onUpdateCategory,
  onUpdateTheme
}: UseDraftManagerProps): UseDraftManagerResult {
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  // 用于跟踪内容变化的引用，用于离开页面提示
  const lastContentRef = useRef<Omit<DraftData, 'lastSaved'>>({
    title: '',
    content: '',
    theme: THEMES[7],
    category: 'talk'
  });
  // 修改保存草稿的键名，加入文章ID
  const draftKey = `blog_draft_${articleId}`;

  // 保存草稿到本地存储的函数
  const saveDraft = useCallback(() => {
    setIsAutoSaving(true);

    const draftData: DraftData = {
      title,
      content,
      category,
      lastSaved: new Date().toISOString(),
      theme
    };

    lastContentRef.current = {
      title,
      content,
      theme,
      category
    };

    const compressed = LZString.compressToUTF16(JSON.stringify(draftData));
    localStorage.setItem(draftKey, compressed);
    setLastSaved(new Date(draftData.lastSaved));
    setIsAutoSaving(false);
  }, [title, content, category, theme, draftKey]);

  // 从草稿箱加载内容
  useEffect(() => {
    const compressedDraft = localStorage.getItem(draftKey);
    if (compressedDraft) {
      try {
        const draft = JSON.parse(
          LZString.decompressFromUTF16(compressedDraft) || '{}'
        ) as DraftData;

        const {
          title: draftTitle,
          content: draftContent,
          category: draftCategory,
          theme: draftTheme,
          lastSaved
        } = draft;

        // 恢复基本内容
        onUpdateTitle(draftTitle || '');
        onUpdateContent(draftContent || '');
        onUpdateCategory(draftCategory || 'talk');
        onUpdateTheme(draftTheme || 'cyberpunk');

        if (lastSaved) {
          setLastSaved(new Date(lastSaved));
        }
      } catch (error) {
        console.error('加载草稿失败:', error);
      }
    }
  }, [
    draftKey,
    onUpdateTitle,
    onUpdateContent,
    onUpdateCategory,
    onUpdateTheme
  ]);

  // 获取所有草稿
  const loadAllDrafts = useCallback(() => {
    const allDrafts = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('blog_draft_')) {
        try {
          const draftId = key.replace('blog_draft_', '');
          const compressed = localStorage.getItem(key);
          if (compressed) {
            const draftData = JSON.parse(
              LZString.decompressFromUTF16(compressed) || '{}'
            ) as DraftData;
            allDrafts.push({
              id: draftId,
              title: draftData.title || '无标题草稿',
              lastSaved: draftData.lastSaved || ''
            });
          }
        } catch (error) {
          console.error('解析草稿数据失败:', error);
        }
      }
    }
    setDrafts(allDrafts);
  }, []);

  // 切换到指定草稿
  const switchToDraft = useCallback(
    (draftId: string) => {
      // 保存当前草稿
      saveDraft();

      // 跳转到新的草稿URL
      const url = new URL(window.location.href);
      url.searchParams.set('id', draftId);
      window.location.href = url.toString();
    },
    [saveDraft]
  );

  // 删除草稿
  const deleteDraft = useCallback(
    (draftId: string) => {
      if (confirm('确定要删除此草稿吗？此操作不可恢复。')) {
        localStorage.removeItem(`blog_draft_${draftId}`);
        loadAllDrafts();

        // 如果删除的是当前草稿，创建新草稿
        if (draftId === articleId) {
          const newId = `article-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
          const url = new URL(window.location.href);
          url.searchParams.set('id', newId);
          window.location.href = url.toString();
        }
      }
    },
    [articleId, loadAllDrafts]
  );

  // 创建新草稿
  const createNewDraft = useCallback(() => {
    const newId = `article-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const url = new URL(window.location.href);
    url.searchParams.set('id', newId);
    window.location.href = url.toString();
  }, []);

  return {
    isAutoSaving,
    lastSaved,
    saveDraft,
    drafts,
    loadAllDrafts,
    switchToDraft,
    deleteDraft,
    createNewDraft,
    lastContentRef
  };
}
