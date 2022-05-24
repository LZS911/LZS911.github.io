---
title: 你不知道的javascript中-笔记
layout: post
date: "2022-05-10"
image: 
headerImage: false
tag:
- javascript
star: true
category: blog
author: LZS_911
description: blog
---


## 类型和语法

1. javascript 有七种内置类型(null、undefined、boolean、number、string、object、symbol) 除对象之外, 其他统称为 “基本类型”

2. ``typeof null === "object"; //true``
  正确的返回结果应该是 `null`, 但这个 `bug` 由来已久, 在 `javascript` 中已经存在了将近二十年, 也许永远不会修复, 因为这牵扯到太多的 `Web` 系统, "修复" 它会产生更多的 `bug`, 令许多系统无法正常工作.
  `null` 是基本类型中的唯一一个 “假值” 类型.

3. `javascript` 中的变量是没有类型的, 只有值才有. 变量可以随时持有任何类型的值.

4. 很多开发人员将 `undefined` 和 `undeclared` 混为一谈，但在 `JavaScript` 中它们是两码事.
`undefined` 是值的一种。`undeclared` 则表示变量还没有被声明过.

5. 使用 `delete` 运算符可以将单元从数组中删除，但是请注意，单元删除后，数
组的 `length` 属性并不会发生变化.

6. 如果字符串键值能够被强制类型转换为十进制数字的话，它就会被当作数字索引来处理。

     ```javascript
     var a = [ ];
     a["13"] = 42;
     a.length; // 14
     ```

7. JavaScript 中字符串是不可变的，而数组是可变的. 字符串不可变是指字符串的成员函数不会改变其原始值，而是创建并返回一个新的字符串. 而数组的成员函数都是在其原始值上进行操作.

8. ``42.toFixed(3)`` 是无效语法，因为 . 被视为常量 42. 的一部分（如前所述），所以没有 . 属性访问运算符来调用 ``toFixed`` 方法。

      ```javascript
      // 无效语法
      42.toFixed( 3 ); // SyntaxError
      // 下面的语法都有效：
      (42).toFixed( 3 ); // "42.000"
      0.42.toFixed( 3 ); // "0.420"
      42..toFixed( 3 ); // "42.000"
     ```

9. 要检测一个值是否是整数，可以使用 `ES6` 中的 `Number.isInteger(..)` 方法

10. undefined 类型只有一个值，即 undefined。null 类型也只有一个值，即 null。它们的名称既是类型也是值。
undefined 和 null 常被用来表示“空的”值或“不是值”的值。二者之间有一些细微的差别。例如：

    • null 指空值（empty value）

    • undefined 指没有值（missing value）

    或者：

    • undefined 指从未赋值

    • null 指曾赋过值，但是目前没有值

    null 是一个特殊关键字，不是标识符，我们不能将其当作变量来使用和赋值。然而
    undefined 却是一个标识符，可以被当作变量来使用和赋值。

11. `isNaN` 与 `Number.isNan` 是有区别的, 前者为全局方法, 后者为 `ES6` 新增工具函数.

    ```javascript
    isNaN('foo'); // true
    Number.isNaN('foo'); //false

    if(!Number.isNaN){
      Number.isNaN = function(n){
        return typeof n === 'number' && isNaN(n);
      }
    }
    ```

12. 由于引用指向的是值本身而非变量，所以一个引用无法更改另一个引用的指向。

     ```javascript
     var a = [1,2,3];
     var b = a;
     a; // [1,2,3]
     b; // [1,2,3]
     // 然后
     b = [4,5,6];
     a; // [1,2,3]
     b; // [4,5,6]
     ```

    `b=[4,5,6]` 并不影响 `a` 指向值 [`1,2,3]`，除非 `b` 不是指向数组的引用，而是指向 `a` 的指针，
     但在 JavaScript 中不存在这种情况！

     函数参数就经常让人产生这样的困惑：

     ```javascript
     function foo(x) {
      x.push( 4 );
      x; // [1,2,3,4]
      // 然后
      x = [4,5,6];
      x.push( 7 );
      x; // [4,5,6,7]
     }
     var a = [1,2,3];
     foo( a );
     a; // 是[1,2,3,4]，不是[4,5,6,7]
     ```

     我们向函数传递 a 的时候，实际是将引用 a 的一个复本赋值给 x，而 a 仍然指向 [1,2,3]。在函数中我们可以通过引用 x 来更改数组的值（push(4) 之后变为 [1,2,3,4]）。但 x = [4,5,6] 并不影响 a 的指向，所以 a 仍然指向 [1,2,3,4]。我们不能通过引用 x 来更改引用 a 的指向，只能更改 a 和 x 共同指向的值。

13. 封 装 对 象（object wrapper） 扮 演 着 十 分 重 要 的 角 色。 由 于 基 本 类 型 值 没 有 .length
和 .toString() 这样的属性和方法，需要通过封装对象才能访问，此时 JavaScript 会自动为基本类型值包装（box 或者 wrap）一个封装对象. 一般情况下，我们不需要直接使用封装对象。最好的办法是让 JavaScript 引擎自己决定什
么时候应该使用封装对象。换句话说，就是应该优先考虑使用 "abc" 和 42 这样的基本类型值，而非 new String("abc") 和 new Number(42).

14. 关于 Boolean 封装对象

    ```javascript
    var a = new Boolean(false);
    console.log(!a); //false
    ```

15. 如果想要自行封装基本类型值，可以使用 Object(..) 函数（不带 new 关键字）：

     ```javascript
     var a = "abc";
     var b = new String( a );
     var c = Object( a );
     typeof a; // "string"
     typeof b; // "object"
     typeof c; // "object"
     b instanceof String; // true
     c instanceof String; // true
     Object.prototype.toString.call( b ); // "[object String]"
     Object.prototype.toString.call( c ); // "[object String]"
     ```

16. 如果想要得到封装对象中的基本类型值，可以使用 valueOf() 函数.

17. 将包含至少一个“空单元”的数组称为“稀疏数组”。

18. 术语“异步”和“并行”常常被混为一谈，但实际上它们的意义完全不同。记住，异步是关于现在和将来的时间间隙，而并行是关于能够同时发生的事情。

19. 对于任务队列最好的理解方式就是，它是挂在事件循环队列的每个 tick 之后的一个队列。在事件循环的每个 tick 中，可能出现的异步动作不会导致一个完整的新事件添加到事件循环队列中，而会在当前 tick 的任务队列末尾添加一个项目（一个任务）。

20. JavaScript 程序总是至少分为两个块：第一块现在运行；下一块将来运行，以响应某个事件。尽管程序是一块一块执行的，但是所有这些块共享对程序作用域和状态的访问，所以对状态的修改都是在之前累积的修改之上进行的。一旦有事件需要运行，事件循环就会运行，直到队列清空。事件循环的每一轮称为一个tick。用户交互、IO 和定时器会向事件队列中加入事件。

21. 回调会受到控制反转的影响，因为回调暗中把控制权交给第三方（通常是不受你控制的第三方工具！）来调用你代码中的 continuation。这种控制转移导致一系列麻烦的信任问题，比如回调被调用的次数是否会超出预期。

22. Promise 决议后就是外部不可变的值，我们可以安全地把这个值传递给第三方，并确信它不会被有意无意地修改。特别是对于多方查看同一个 Promise决议的情况，尤其如此。一方不可能影响另一方对 Promise 决议的观察结果。

23. 我们侦听的 Promise 决议“事件”严格说来并不算是事件（尽管它们实现目标的行为方式确实很像事件），通常也不叫作 "completion" 或 "error"。事实上，我们通过 then(..) 注册一个 "then" 事件。或者可能更精确地说，then(..) 注册 "fullfillment" 和 / 或 "rejection" 事件，尽管我们并不会在代码中直接使用这些术语。

24. 调用 Promise 的 then(..) 会自动创建一个新的 Promise 从调用返回。在完成或拒绝处理函数内部，如果返回一个值或抛出一个异常，新返回的（可链接的）Promise 就相应地决议。如果完成或拒绝处理函数返回一个 Promise，它将会被展开，这样一来，不管它的决议值是什么，都会成为当前 then(..) 返回的链接 Promise 的决议值。

25. 一旦创建了一个 Promise 并为其注册了完成和 / 或拒绝处理函数，如果出现某种情况使得这个任务悬而未决的话，你也没有办法从外部停止它的进程。
