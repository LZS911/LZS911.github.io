'use client';

import clsx from 'clsx';
import useDragging from '../hooks/useDragging';
import usePosition from '../hooks/usePosition';

interface PortalButtonProps {
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}

export default function PortalButton({
  setIsOpen,
  isOpen,
  buttonRef
}: PortalButtonProps) {
  const {
    position,
    setPosition,
    isMinimized,
    setIsMinimized,
    currentPositionRef,
    isNearLeftEdge,
    isNearRightEdge,
    checkEdgeProximity,
    savePositionToLocalStorage,
    getButtonPositionStyle
  } = usePosition();

  const { isDragging, handleDragStart, handleClick } = useDragging(
    position,
    setPosition,
    currentPositionRef,
    checkEdgeProximity,
    savePositionToLocalStorage,
    buttonRef
  );
  return (
    <button
      ref={buttonRef}
      onClick={() => handleClick(() => setIsOpen(!isOpen))}
      onMouseDown={handleDragStart}
      onMouseEnter={() => setIsMinimized(false)}
      onMouseLeave={() => {
        checkEdgeProximity(position, isDragging);
      }}
      style={getButtonPositionStyle(isDragging)}
      className={clsx(
        {
          'w-4 opacity-50': isMinimized,
          'w-12': !isMinimized,
          'transition-all duration-300 ease-out': !isDragging,
          'cursor-grabbing': isDragging,
          'cursor-grab': !isDragging,
          'rounded-l-none': isNearLeftEdge,
          'rounded-r-none': isNearRightEdge
        },
        `portal-button-namespace z-40 h-12 bg-black hover:bg-gray-600 text-white rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.2)] backdrop-blur-sm bg-opacity-80 transform-style-fix`
      )}
      aria-label="工具箱"
    >
      {/* 使用工具箱图标，最小化时不显示 */}
      {!isMinimized && (
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      )}
    </button>
  );
}
