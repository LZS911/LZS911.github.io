const initMouseEffect = () => {
  document.body.addEventListener("click", genMouseClickEffect);
};

const removeMouseEffect = () => {
  document.body.removeEventListener("click", genMouseClickEffect);
};

const genMouseClickEffect = (e: MouseEvent) => {
  if ((e.target as HTMLElement).tagName === "A") {
    return;
  }
  let x = e.pageX;
  let y = e.pageY;

  const { create, remove, setColor } = generateElement(x, y, "❤");

  create();

  setColor();

  setTimeout(function () {
    remove();
  }, 1900);
};

/**
 *
 * @param x 生成元素 x 坐标
 * @param y 生成元素 y 坐标
 * @param content 元素内容
 */
const generateElement = (x: number, y: number, content: string) => {
  const span = document?.createElement("span");
  const create = () => {
    let body = document.body;

    if (!span || !body) {
      return;
    }

    span.innerHTML = content;
    span.className = "mouse-effect-text";
    span.style.top = y - 8 + "px";
    span.style.left = x - 8 + "px";
    span.style.animation = "remove-mouse-effect 2s";
    body.appendChild(span);
    let i = 0;
    setInterval(() => {
      span.style.top = y - 20 - i + "px";
      i++;
    }, 10);

    return span;
  };

  const remove = () => {
    if (!span || !span.remove) {
      return;
    }
    span.remove();
  };

  const setColor = () => {
    if (!span) {
      return;
    }
    const color = getRandomColor();
    span.style.color = color;
  };

  return {
    create,
    remove,
    setColor,
  };
};
const getRandomColor = () => {
  let allType = "0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f";
  let allTypeArr = allType.split(",");
  let color = "#";
  for (var i = 0; i < 6; i++) {
    var random = parseInt((Math.random() * allTypeArr.length).toString());
    color += allTypeArr[random];
  }
  return color;
};

export { initMouseEffect, removeMouseEffect };
