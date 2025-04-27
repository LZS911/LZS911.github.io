import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle
} from 'react';
import MDEditor from '@uiw/react-md-editor';
import { getImageUploader } from '@/lib/image-upload';

interface MarkdownEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSaveDraft: () => void;
  setUploadProgress?: (message: string, autoHideTime?: number) => void;
}

export interface MarkdownEditorRef {
  getTextareaRef: () => HTMLTextAreaElement | null;
}

const MarkdownEditor = forwardRef<MarkdownEditorRef, MarkdownEditorProps>(
  ({ content, onChange, onSaveDraft, setUploadProgress }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
      getTextareaRef: () => textareaRef.current
    }));

    // 设置粘贴事件监听
    useEffect(() => {
      // 处理粘贴事件
      const handlePaste = async (e: ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            e.preventDefault();

            const file = items[i].getAsFile();
            if (!file) continue;

            try {
              // 设置上传状态
              setUploadProgress?.('上传图片中...');

              // 调用上传器
              const imageUploader = getImageUploader();
              const imageUrl = await imageUploader.uploadImage(file);

              // 获取光标位置
              const textarea = textareaRef.current;
              const cursorPosition = textarea ? textarea.selectionStart : -1;

              // 在光标处插入图片Markdown
              const imageMarkdown = `![图片](${imageUrl})`;
              const newContent = insertTextAtCursor(
                content,
                imageMarkdown,
                cursorPosition
              );
              onChange(newContent);

              // 显示上传成功消息
              setUploadProgress?.('图片上传成功!', 3000);

              // 保存草稿
              onSaveDraft();
            } catch (error) {
              console.error('上传图片失败:', error);
              setUploadProgress?.('图片上传失败', 3000);
            }
            break;
          }
        }
      };

      // 处理键盘事件，实现一键删除图片
      const handleKeyDown = (e: KeyboardEvent) => {
        // 跳过带修饰键的操作（允许撤销操作）
        if (e.metaKey || e.ctrlKey) return;

        // 仅处理删除键
        if (e.key !== 'Delete' && e.key !== 'Backspace') return;

        // 获取光标位置
        const textarea = textareaRef.current;
        if (!textarea) return;

        const cursorPos = textarea.selectionStart;
        if (cursorPos === null) return;

        // 检查是否有选择的文本范围，如果有就跳过（让用户正常删除选定文本）
        if (textarea.selectionStart !== textarea.selectionEnd) return;

        // 记住当前滚动位置
        const scrollTop = textarea.scrollTop;

        // 调整光标位置以处理退格键（光标前）和删除键（光标后）
        const effectiveCursorPos =
          e.key === 'Backspace' ? cursorPos - 1 : cursorPos;
        if (effectiveCursorPos < 0) return;

        // 查找包含当前光标位置的图片标记
        const contentToSearch = content;
        let startIndex = -1;
        let endIndex = -1;

        // 检查光标是否在图片标记内
        // 查找最近的![
        let i = effectiveCursorPos;
        while (i >= 1) {
          if (contentToSearch[i - 1] === '!' && contentToSearch[i] === '[') {
            startIndex = i - 1;
            break;
          }
          i--;
        }

        // 如果找到了开始标记，继续查找结束括号
        if (startIndex >= 0) {
          let brackets = 0;
          for (i = startIndex; i < contentToSearch.length; i++) {
            if (contentToSearch[i] === '(') brackets++;
            if (contentToSearch[i] === ')') {
              brackets--;
              if (brackets === 0) {
                endIndex = i + 1;
                break;
              }
            }
          }
        }

        // 如果找到了完整的图片标记，并且光标在其中
        if (
          startIndex >= 0 &&
          endIndex > startIndex &&
          effectiveCursorPos >= startIndex &&
          effectiveCursorPos <= endIndex
        ) {
          // 提取图片URL
          const imgText = contentToSearch.substring(startIndex, endIndex);
          const urlMatch = imgText.match(/\]\((.*?)(?:#|$)/);

          if (urlMatch && urlMatch[1]) {
            const imageUrl = urlMatch[1];

            // 新内容（删除了图片标记）
            const textBefore = textarea.value.substring(0, startIndex);
            const textAfter = textarea.value.substring(endIndex);
            const newText = textBefore + textAfter;

            // 手动执行删除
            // 1. 先选中整个图片标记
            textarea.setSelectionRange(startIndex, endIndex);

            // 2. 执行删除
            textarea.value = newText;
            // 触发input事件以让React知道值改变了
            textarea.dispatchEvent(
              new InputEvent('input', {
                inputType: 'deleteContentBackward',
                data: null,
                bubbles: true,
                cancelable: true
              })
            );
            // 确保React状态更新
            onChange(newText);

            // 3. 保持光标位置
            setTimeout(() => {
              textarea.selectionStart = startIndex;
              textarea.selectionEnd = startIndex;
              textarea.scrollTop = scrollTop;
              textarea.focus();
            }, 0);

            // 删除图片资源
            const imageUploader = getImageUploader();
            imageUploader.deleteImage(imageUrl);

            // 显示删除成功消息
            setUploadProgress?.('图片已删除', 2000);

            // 保存草稿
            onSaveDraft();

            // 阻止默认行为
            e.preventDefault();
          }
        }
      };

      // 先找到 textarea 元素
      const findTextarea = () => {
        if (editorRef.current) {
          // 在编辑器容器内找到textarea元素
          const textarea = editorRef.current.querySelector('textarea');
          if (textarea) {
            textareaRef.current = textarea as HTMLTextAreaElement;
            textarea.addEventListener('paste', handlePaste);
            textarea.addEventListener('keydown', handleKeyDown);
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
          textareaRef.current.removeEventListener('keydown', handleKeyDown);
        }
      };
    }, [content, onChange, onSaveDraft, setUploadProgress]);

    return (
      <div ref={editorRef} className="flex-1 w-full">
        <MDEditor
          value={content}
          onChange={(val) => onChange(val || '')}
          height={window.innerHeight - 100}
          preview="edit"
          className="editor-fullscreen h-full"
          hideToolbar={false}
          textareaProps={{
            placeholder: '请输入文章内容...',
            'aria-label': '可以粘贴图片（Ctrl+V）到编辑器中'
          }}
        />
      </div>
    );
  }
);

MarkdownEditor.displayName = 'MarkdownEditor';

// 在光标位置插入文本的辅助函数
const insertTextAtCursor = (
  text: string,
  insertText: string,
  position: number
): string => {
  if (position >= 0 && position <= text.length) {
    return text.slice(0, position) + insertText + text.slice(position);
  }
  return text + '\n' + insertText;
};

export default MarkdownEditor;
