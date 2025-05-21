// 获取不包含滚动条的视口宽度
export const getViewportWidth = () => {
  if (typeof document !== 'undefined') {
    return document.documentElement.clientWidth;
  }
  return 0;
};

// 获取视口高度
export const getViewportHeight = () => {
  if (typeof document !== 'undefined') {
    return document.documentElement.clientHeight;
  }
  return 0;
};

export const PORTAL_BUTTON_SIZE = 54;

export const PORTAL_MINI_BUTTON_SIZE = 18;
