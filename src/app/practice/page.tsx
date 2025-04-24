'use client';

import MDEditor from '@uiw/react-md-editor';
import { useState, useEffect, useRef, useCallback } from 'react';
import { createPullRequest } from '@/lib/pull-request';
import Avatar from '../../ui/article/avatar';
import { THEMES } from '../../lib/theme';
import Theme from '../../../@types/theme';
import { generateArticleContent } from '../../lib/template';
import PostType from '../../types/post';
import LZString from 'lz-string';
import { format } from 'date-fns';
import { getImageUploader, replaceImageUrls } from '@/lib/image-upload';

const categories: Array<PostType['category']> = ['talk', 'project', 'blog'];

export default function Page() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PostType['category']>(categories[0]);
  const [theme, setTheme] = useState<Theme>(THEMES[0]);
  const [loading, setLoading] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const lastContentRef = useRef({
    title: '',
    content: '',
    theme: '',
    category: categories[0]
  });

  // 处理粘贴事件
  const handlePaste = useCallback(
    async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault(); // 阻止默认粘贴行为

          const file = items[i].getAsFile();
          if (!file) continue;

          try {
            setIsUploading(true);

            // 获取光标位置
            const textarea = textareaRef.current;
            const cursorPosition = textarea ? textarea.selectionStart : -1;

            // 先插入占位符
            const placeholderId = `img-upload-${Date.now()}`;
            const placeholder = `![正在上传图片...](data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmaWxsPSIjOTk5Ij7mraPluLjkuIrkvKDkuK0uLi48L3RleHQ+PC9zdmc+#${placeholderId})`;

            const newContentWithPlaceholder = insertPlaceholder(
              content,
              placeholder,
              cursorPosition
            );
            setContent(newContentWithPlaceholder);

            setUploadProgress('上传图片中...');

            // 使用图片上传服务
            const imageUploader = getImageUploader();
            const imageUrl = await imageUploader.uploadImage(file);

            // 替换占位符为实际图片
            const finalContent = replacePlaceholder(
              newContentWithPlaceholder,
              placeholderId,
              imageUrl
            );
            setContent(finalContent);

            setUploadProgress('图片上传成功!');
            setTimeout(() => setUploadProgress(''), 3000);
          } catch (error) {
            console.error('粘贴图片失败:', error);
            setUploadProgress('图片上传失败，请重试');
            setTimeout(() => setUploadProgress(''), 3000);
          } finally {
            setIsUploading(false);
          }

          break;
        }
      }
    },
    [content]
  );

  // 插入占位符的辅助函数
  const insertPlaceholder = (
    text: string,
    placeholder: string,
    position: number
  ): string => {
    if (position >= 0 && position <= text.length) {
      return text.slice(0, position) + placeholder + text.slice(position);
    }
    return text + '\n' + placeholder;
  };

  // 替换占位符的辅助函数
  const replacePlaceholder = (
    text: string,
    placeholderId: string,
    imageUrl: string
  ): string => {
    const regex = new RegExp(
      `!\\[正在上传图片...\\]\\(data:image\\/svg\\+xml;base64,[^#]+#${placeholderId}\\)`,
      'g'
    );
    return text.replace(
      regex,
      `![${imageUrl.split('#')[1] || 'image'}](${imageUrl.split('#')[0]})`
    );
  };

  // 设置粘贴事件监听
  useEffect(() => {
    // 先找到 textarea 元素
    const findTextarea = () => {
      if (editorRef.current) {
        // 在编辑器容器内找到textarea元素
        const textarea = editorRef.current.querySelector('textarea');
        if (textarea) {
          textareaRef.current = textarea as HTMLTextAreaElement;
          textarea.addEventListener('paste', handlePaste);
          return true;
        }
      }
      return false;
    };

    // 尝试立即查找
    if (!findTextarea()) {
      // 如果没找到，等DOM更新后再尝试
      const timer = setTimeout(() => {
        findTextarea();
      }, 500);
      return () => clearTimeout(timer);
    }

    return () => {
      if (textareaRef.current) {
        textareaRef.current.removeEventListener('paste', handlePaste);
      }
    };
  }, [handlePaste]);

  // 从草稿箱加载内容
  useEffect(() => {
    const compressedDraft = localStorage.getItem('blog_draft');
    if (compressedDraft) {
      try {
        const draft = JSON.parse(
          LZString.decompressFromUTF16(compressedDraft) || '{}'
        );
        const {
          title: draftTitle,
          content: draftContent,
          category: draftCategory,
          theme: draftTheme,
          lastSaved
        } = draft;
        setTitle(draftTitle || '');
        setContent(draftContent || '');
        setCategory(draftCategory || categories[0]);
        setTheme(draftTheme || THEMES[0]);
        lastContentRef.current = {
          title: draftTitle || '',
          content: draftContent || '',
          theme: draftTheme || THEMES[0],
          category: draftCategory || categories[0]
        };
        setLastSaved(new Date(lastSaved));
      } catch (error) {
        console.error('Failed to load draft:', error);
      }
    }
  }, []);

  // 定时自动保存
  useEffect(() => {
    const saveDraft = () => {
      setIsAutoSaving(true);
      const draftData = {
        title,
        content,
        category,
        lastSaved: new Date().toISOString(),
        theme
      };
      const compressed = LZString.compressToUTF16(JSON.stringify(draftData));
      localStorage.setItem('blog_draft', compressed);
      lastContentRef.current = { title, content, category, theme };
      setLastSaved(new Date(draftData.lastSaved));
      setIsAutoSaving(false);
    };

    // 每30秒自动保存一次
    const autoSaveInterval = setInterval(saveDraft, 30000);

    return () => {
      clearInterval(autoSaveInterval);
    };
  }, [title, content, category, theme]);

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
  }, [category, content, isAutoSaving, theme, title]);

  const handleSubmit = async () => {
    if (!content || !title) {
      alert('标题和内容不能为空');
      return;
    }

    setLoading(true);
    try {
      // 替换所有临时Blob URL为实际URL
      const processedContent = replaceImageUrls(content);

      const path = `_posts/${title}.md`;
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
        alert('提交成功！PR链接：' + result.url);
        // 清除草稿
        localStorage.removeItem('blog_draft');
        setContent('');
        setTitle('');
        setLastSaved(null);
        window.open(result.url, '_blank');
      }
    } catch (error) {
      alert('提交失败：' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <div className="flex items-center justify-between px-6 py-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 sticky top-0 z-10">
        <div className="flex items-center gap-4 flex-1">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="请输入文章标题"
            className="text-2xl font-bold px-4 py-2 w-1/3 border-none focus:outline-none focus:ring-0 dark:bg-gray-800 dark:text-white placeholder-gray-400"
          />
          <div className="flex items-center gap-2">
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value as PostType['category'])
              }
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-transparent"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as Theme)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-transparent"
            >
              {THEMES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
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
            onClick={handleSubmit}
            disabled={loading || isUploading}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '提交中...' : '发布文章'}
          </button>
        </div>
      </div>

      <div className="flex-1 w-full">
        {typeof window !== 'undefined' && (
          <div ref={editorRef}>
            <MDEditor
              value={content}
              onChange={(val) => setContent(val || '')}
              height={window.innerHeight - 76}
              preview="edit"
              className="editor-fullscreen h-full"
              hideToolbar={false}
              textareaProps={{
                placeholder: '请输入文章内容...',
                'aria-label': '可以粘贴图片（Ctrl+V）到编辑器中'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
