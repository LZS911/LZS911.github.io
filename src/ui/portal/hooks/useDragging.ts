import { useEffect, useRef, useState } from 'react';
import {
  PORTAL_BUTTON_SIZE,
  getViewportWidth,
  getViewportHeight
} from '../common';

// 设置一个拖拽距离阈值，小于这个值视为点击
const DRAG_THRESHOLD = 3;

export default function useDragging(
  position: { x: number; y: number },
  setPosition: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>,
  currentPositionRef: React.MutableRefObject<{ x: number; y: number }>,
  checkEdgeProximity: (
    pos: { x: number; y: number },
    isDragging: boolean
  ) => void,
  savePositionToLocalStorage: (pos: { x: number; y: number }) => void,
  buttonRef: React.RefObject<HTMLButtonElement | null>
) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  // 添加拖拽标识，用于区分拖拽和点击
  const [wasDragged, setWasDragged] = useState(false);
  const dragTimeout = useRef<NodeJS.Timeout | null>(null);
  const startPosRef = useRef({ x: 0, y: 0 });

  // 添加动画帧请求引用
  const animationFrameRef = useRef<number | null>(null);

  const handleDragStart = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      setIsDragging(true);
      setWasDragged(false); // 重置拖拽标识
      // 保存开始拖拽时的位置
      startPosRef.current = { x: e.clientX, y: e.clientY };
      // 计算鼠标点击位置与按钮左上角的偏移量
      const rect = buttonRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  // 处理拖拽过程
  useEffect(() => {
    const handleDragMove = (e: MouseEvent) => {
      if (isDragging) {
        // 计算拖拽距离
        const dragDistance = Math.sqrt(
          Math.pow(e.clientX - startPosRef.current.x, 2) +
            Math.pow(e.clientY - startPosRef.current.y, 2)
        );

        // 只有当拖拽距离超过阈值时才视为拖拽
        if (dragDistance > DRAG_THRESHOLD) {
          // 设置拖拽标识
          setWasDragged(true);
        }

        // 取消之前请求的动画帧
        if (animationFrameRef.current !== null) {
          cancelAnimationFrame(animationFrameRef.current);
        }

        // 计算新位置
        const newPosition = {
          x: Math.max(
            0,
            Math.min(
              getViewportWidth() - PORTAL_BUTTON_SIZE,
              e.clientX - dragOffset.x
            )
          ),
          y: Math.max(
            0,
            Math.min(
              getViewportHeight() - PORTAL_BUTTON_SIZE,
              e.clientY - dragOffset.y
            )
          )
        };

        // 更新当前位置引用（这个会立即更新，用于渲染）
        currentPositionRef.current = newPosition;

        // 使用requestAnimationFrame限制状态更新频率
        animationFrameRef.current = requestAnimationFrame(() => {
          setPosition(newPosition);
        });
      }
    };

    const handleDragEnd = () => {
      // 取消任何待处理的动画帧
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      setIsDragging(false);
      // 确保最终状态更新到React状态
      setPosition(currentPositionRef.current);
      // 保存最终位置到localStorage
      savePositionToLocalStorage(currentPositionRef.current);

      // 拖拽结束后，保持拖拽标识一段时间，防止误触
      if (dragTimeout.current) {
        clearTimeout(dragTimeout.current);
      }

      dragTimeout.current = setTimeout(() => {
        setWasDragged(false);
      }, 300); // 300ms 后重置拖拽标识
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleDragMove);
      window.addEventListener('mouseup', handleDragEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleDragMove);
      window.removeEventListener('mouseup', handleDragEnd);

      // 清理可能的动画帧
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    isDragging,
    dragOffset,
    currentPositionRef,
    setPosition,
    savePositionToLocalStorage
  ]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (dragTimeout.current) {
        clearTimeout(dragTimeout.current);
      }

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // 检查按钮是否靠近边缘，更新最小化状态
  useEffect(() => {
    if (buttonRef.current && !isDragging) {
      checkEdgeProximity(position, isDragging);
    }
  }, [buttonRef, isDragging, position, checkEdgeProximity]);

  // 处理点击事件
  const handleClick = (callback: () => void) => {
    // 只有在没有拖拽的情况下才执行回调
    if (!wasDragged) {
      callback();
    }
  };

  return {
    isDragging,
    wasDragged,
    buttonRef,
    handleDragStart,
    handleClick
  };
}
