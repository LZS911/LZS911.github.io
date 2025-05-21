import { useEffect, useRef, useState } from 'react';

export default function usePortalState() {
  const [isOpen, setIsOpen] = useState(false);
  const portalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 点击外部关闭面板
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        portalRef.current &&
        !portalRef.current.contains(event.target as Node) &&
        // 确保点击的是遮罩层，而不是内部元素
        (event.target as Element).classList.contains('portal-overlay')
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // ESC键关闭面板
  useEffect(() => {
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);

  return {
    isOpen,
    setIsOpen,
    portalRef,
    buttonRef
  };
}
