'use client';

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  CSSProperties
} from 'react';
import {
  getViewportWidth,
  getViewportHeight,
  PORTAL_BUTTON_SIZE,
  PORTAL_MINI_BUTTON_SIZE
} from '../common';

// 存储在localStorage中的key
const POSITION_STORAGE_KEY = 'portal-button-position';

export default function usePosition() {
  // 添加按钮位置状态
  const [position, setPosition] = useState({ x: 0, y: 0 });
  // 按钮是否最小化
  const [isMinimized, setIsMinimized] = useState(false);
  const currentPositionRef = useRef({ x: 0, y: 0 });

  // 从localStorage加载位置并初始化按钮位置
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedPosition = localStorage.getItem(POSITION_STORAGE_KEY);
        if (savedPosition) {
          const parsedPosition = JSON.parse(savedPosition);
          // 确保位置在屏幕内
          const newPosition = {
            x: Math.min(
              parsedPosition.x,
              getViewportWidth() - PORTAL_BUTTON_SIZE
            ),
            y: Math.min(parsedPosition.y, getViewportHeight() - 60)
          };
          setPosition(newPosition);
          currentPositionRef.current = newPosition;
        } else {
          // 默认设置在右下角
          const defaultPosition = {
            x: getViewportWidth() - 76,
            y: getViewportHeight() - 76
          };
          setPosition(defaultPosition);
          currentPositionRef.current = defaultPosition;
        }
      } catch (error) {
        console.error('Failed to load position from localStorage:', error);
        // 出错时使用默认位置
        const defaultPosition = {
          x: getViewportWidth() - 76,
          y: getViewportHeight() - 76
        };
        setPosition(defaultPosition);
        currentPositionRef.current = defaultPosition;
      }
    }
  }, []);

  // 检查按钮是否靠近边缘
  const checkEdgeProximity = useCallback(
    (pos: { x: number; y: number }, isDragging: boolean) => {
      if (!isDragging) {
        const isNearLeftEdge = pos.x === 0;
        const isNearRightEdge =
          pos.x === getViewportWidth() - PORTAL_BUTTON_SIZE;

        setIsMinimized(isNearLeftEdge || isNearRightEdge);
      }
    },
    []
  );

  // 保存位置到localStorage
  const savePositionToLocalStorage = useCallback(
    (pos: { x: number; y: number }) => {
      try {
        localStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(pos));
      } catch (error) {
        console.error('Failed to save position to localStorage:', error);
      }
    },
    []
  );

  // 窗口大小改变时调整按钮位置
  useEffect(() => {
    const handleResize = () => {
      let newPosition;
      if (isMinimized && position.x === 0) {
        // 如果贴近左侧，保持x=0
        newPosition = {
          x: 0,
          y: Math.min(position.y, getViewportHeight() - 60)
        };
      } else if (isMinimized) {
        // 如果贴近右侧，重新计算x使其继续贴近右侧
        newPosition = {
          x: getViewportWidth() - PORTAL_BUTTON_SIZE,
          y: Math.min(position.y, getViewportHeight() - 60)
        };
      } else {
        // 普通情况，确保按钮在屏幕内
        newPosition = {
          x: Math.min(position.x, getViewportWidth() - PORTAL_BUTTON_SIZE),
          y: Math.min(position.y, getViewportHeight() - 60)
        };
      }

      setPosition(newPosition);
      currentPositionRef.current = newPosition;
      savePositionToLocalStorage(newPosition);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMinimized, position, savePositionToLocalStorage]);

  const isNearLeftEdge = useMemo(() => {
    return position.x === 0;
  }, [position.x]);

  const isNearRightEdge = useMemo(() => {
    if (typeof window !== 'undefined') {
      return position.x === getViewportWidth() - PORTAL_BUTTON_SIZE;
    }
    return false;
  }, [position.x]);

  // 根据最小化状态和靠近的边缘计算按钮位置样式
  const getButtonPositionStyle = useCallback(
    (isDragging: boolean): CSSProperties => {
      // 使用拖拽中的实时位置
      const pos = isDragging ? currentPositionRef.current : position;

      if (isMinimized) {
        if (isNearRightEdge) {
          // 靠近右侧边缘，确保按钮右侧与浏览器边缘对齐
          return {
            transform: `translate3d(${getViewportWidth() - PORTAL_MINI_BUTTON_SIZE}px, ${pos.y}px, 0)`,
            position: 'fixed',
            top: 0,
            left: 0,
            transformOrigin: 'right center' // 从左侧进行缩放
          };
        } else if (isNearLeftEdge) {
          // 靠近左侧边缘，确保按钮左侧与浏览器边缘对齐
          return {
            transform: `translate3d(0px, ${pos.y}px, 0)`,
            position: 'fixed',
            top: 0,
            left: 0,
            transformOrigin: 'left center' // 从左侧进行缩放
          };
        }
      }

      // 默认位置 - 使用 transform 而不是 left/top
      return {
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        position: 'fixed',
        top: 0,
        left: 0,
        transformOrigin: 'center center' // 从中心进行缩放
      };
    },
    [isMinimized, isNearLeftEdge, isNearRightEdge, position]
  );

  return {
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
  };
}
