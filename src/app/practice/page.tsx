'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { createPullRequest } from '@/lib/pull-request';
import PostType from '@/types/post';
import markdownToHtml from '@/lib/markdown-to-html';
import {
  replaceImageUrls,
  getImageUploader,
  FileSystemImageUploader,
  type ImageInfo
} from '@/lib/image-upload';
import { THEMES } from '@/lib/theme';
import {
  generateArticleContent,
  generatePreviewTemplate
} from '@/lib/template';
import DraftsList from '@/ui/practice/drafts-list';
import EditorHeader from '@/ui/practice/editor-header';
import EditorToolbar from '@/ui/practice/editor-toolbar';
import MarkdownEditor, {
  MarkdownEditorRef
} from '@/ui/practice/markdown-editor';
import { useDraftManager } from '@/ui/practice/draft-manager';
import { useImageUploadHandler } from '@/ui/practice/image-upload-handler';
import { Theme } from '@/types/theme';
import { useSearchParams } from 'next/navigation';

// 博客文章分类
const categories: Array<PostType['category']> = ['talk', 'project', 'blog'];

export default function Page() {
  // 编辑器内容状态
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PostType['category']>(categories[0]);
  const [theme, setTheme] = useState<Theme>(THEMES[7]);
  const searchParams = useSearchParams();

  // 其他UI状态
  const [loading, setLoading] = useState(false);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [showDraftList, setShowDraftList] = useState(false);

  // 编辑器引用
  const editorRef = useRef<MarkdownEditorRef>(null);
  // 在用户打开编辑页面时，生成或获取篇章ID
  const articleId = useMemo<string>(() => {
    // 从URL获取文章ID
    const id = searchParams.get('id');
    // 如果URL中有ID，使用该ID，否则生成新ID
    return (
      id ||
      `article-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
    );
  }, [searchParams]);

  // 使用图片上传处理钩子
  const { isUploading, uploadProgress, setUploadProgress } =
    useImageUploadHandler();

  // 使用草稿管理器钩子
  const {
    isAutoSaving,
    lastSaved,
    saveDraft,
    drafts,
    loadAllDrafts,
    switchToDraft,
    deleteDraft,
    createNewDraft,
    lastContentRef
  } = useDraftManager({
    articleId,
    title,
    content,
    category,
    theme,
    onUpdateTitle: setTitle,
    onUpdateContent: setContent,
    onUpdateCategory: setCategory,
    onUpdateTheme: setTheme
  });

  // 在组件挂载时，更新URL
  useEffect(() => {
    // 将文章ID添加到URL
    const url = new URL(window.location.href);
    url.searchParams.set('id', articleId);
    window.history.replaceState({}, '', url.toString());
  }, [articleId]);

  // 文章提交处理
  const handleSubmit = async () => {
    if (!content || !title) {
      alert('标题和内容不能为空');
      return;
    }

    setLoading(true);
    try {
      // 1. 获取图片上传器实例
      const imageUploader = getImageUploader();

      // 2. 确保所有图片都有内容 (针对FileSystemImageUploader)
      if (imageUploader instanceof FileSystemImageUploader) {
        // 从内容中提取所有临时图片URL
        const temporaryImages: Record<string, boolean> = {};
        content.replace(/!\[.*?\]\((.*?)(?:#.*?)?\)/g, (match, url) => {
          temporaryImages[url] = true;
          return match;
        });

        // 加载所有当前可能没有内容的图片
        await Promise.all(
          imageUploader.getUploadedImages().map(async (img: ImageInfo) => {
            // 如果图片在文章中使用且没有内容，则获取内容
            if (!img.content && img.blobUrl && temporaryImages[img.blobUrl]) {
              try {
                // 从临时图片URL获取图片内容
                const response = await fetch(img.blobUrl);
                if (response.ok) {
                  const blob = await response.blob();
                  const arrayBuffer = await blob.arrayBuffer();
                  img.content = Buffer.from(arrayBuffer).toString('base64');
                }
              } catch (error) {
                console.error(`获取图片 ${img.name} 内容失败:`, error);
              }
            }
          })
        );
      }

      // 3. 替换临时路径为真实路径
      const processedContent = replaceImageUrls(content);
      const path = `_posts/${title}.md`;

      // 4. 提交博客和图片，并创建PR
      const result = await createPullRequest({
        title,
        content: generateArticleContent(
          title,
          processedContent,
          theme,
          category
        ),
        path
      });

      if (result?.url) {
        // 5. 成功后清理
        localStorage.removeItem(`blog_draft_${articleId}`);
        setContent('');
        setTitle('');

        // 显示成功信息
        alert(`提交成功！PR链接：${result.url}`);

        // 打开PR链接
        window.open(result.url, '_blank');
      }
    } catch (error) {
      alert('提交失败：' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // 生成预览处理
  const handleGeneratePreview = useCallback(async () => {
    if (!content || !title) {
      alert('标题和内容不能为空');
      return;
    }

    try {
      setIsGeneratingPreview(true);

      const htmlContent = await markdownToHtml(content);

      const previewHtml = generatePreviewTemplate(title, htmlContent, theme);

      const response = await fetch('/api/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ html: previewHtml })
      });

      if (!response.ok) {
        throw new Error('服务器端创建预览失败');
      }

      const { previewId } = await response.json();

      window.open(`/api/preview/${previewId}`, '_blank');
    } catch (error) {
      console.error('生成预览失败:', error);
      alert('生成预览失败: ' + (error as Error).message);
    } finally {
      setIsGeneratingPreview(false);
    }
  }, [title, content, theme]);

  // 定时自动保存
  useEffect(() => {
    // 每30秒自动保存一次
    const autoSaveInterval = setInterval(saveDraft, 30000);

    return () => {
      clearInterval(autoSaveInterval);
    };
  }, [saveDraft]);

  // 页面离开提示
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const hasChanges =
        lastContentRef.current.title !== title ||
        lastContentRef.current.content !== content ||
        lastContentRef.current.category !== category ||
        lastContentRef.current.theme !== theme;

      if (isAutoSaving || hasChanges) {
        e.preventDefault();
        e.returnValue = '您有未保存的更改，确定要离开吗？';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, content, isAutoSaving, theme, title]);

  // 草稿列表管理
  const handleShowDraftList = () => {
    loadAllDrafts();
    setShowDraftList(!showDraftList);
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="flex items-center justify-between px-6 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
        <EditorHeader
          title={title}
          onTitleChange={setTitle}
          category={category}
          onCategoryChange={setCategory}
          theme={theme}
          onThemeChange={setTheme}
          categories={categories}
        />
        <EditorToolbar
          isAutoSaving={isAutoSaving}
          lastSaved={lastSaved}
          uploadProgress={uploadProgress}
          loading={loading}
          isUploading={isUploading}
          isGeneratingPreview={isGeneratingPreview}
          onSaveDraft={saveDraft}
          onGeneratePreview={handleGeneratePreview}
          onSubmit={handleSubmit}
          onShowDraftList={handleShowDraftList}
        />
      </div>

      {typeof window !== 'undefined' && (
        <MarkdownEditor
          ref={editorRef}
          content={content}
          onChange={setContent}
          onSaveDraft={saveDraft}
          setUploadProgress={setUploadProgress}
        />
      )}

      <DraftsList
        drafts={drafts}
        currentArticleId={articleId}
        showDraftList={showDraftList}
        onClose={() => setShowDraftList(false)}
        onSwitchDraft={switchToDraft}
        onDeleteDraft={deleteDraft}
        onCreateNewDraft={createNewDraft}
      />
    </div>
  );
}
