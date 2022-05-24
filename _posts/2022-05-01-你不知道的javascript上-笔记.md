---
title: 你不知道的javascript上-笔记
layout: post
date: "2022-05-01"
image: 
headerImage: false
tag:
- javascript
star: true
category: blog
author: LZS_911
description: blog
---

## 什么是 ``[[Prototype]]``?

  JavaScript中的对象有一个特殊的``[[Prototype]]``内置属性, 其实就是对于其他对象的引用。几乎所有的对象在创建时``[[Prototype]]``属性都会被赋予一个非空的值。(也存在``[[Prototype]]``属性为空的情况, 虽然其不常见)。
  
  ```javascript
  const myObj = {
      a: 'hello prototype'
  }
  myObj.a // 'hello prototype'
  ```

  当我们使用 ``.引用`` 或者 ``[]引用``属性 ``a``时, 会触发``[[GET]]``操作。对于默认``[[GET]]``操作来说, 首先会去检查对象本身是否有该属性, 如果有的话就是用它, 否则就需要使用对象``[[Prototype]]``链了。
  
  ```javascript
  const sourceObj = {
      a: 'hello prototype'
  };
  //创建一个关联到sourceObj的对象
  const targetObj = Object.create(sourceObj);
  targetObj.a  // 'hello prototype'
  ```

  上述代码中显然属性``a``是不存在targetObj上的, 但是我们使用 ``Object.create``方法创建该对象后, 将其``[[Prototype]]``关联到了``sourceObj``上, 便可正常的访问到属性``a``了。但是, 如果当``sourceObj``上也不存在属性``a``并且``[[Prototype]]``也不为空, 就会继续查找下去。这个过程会持续到找到匹配的属性或者查找完一条完整的``[[Prototype]]``链。如果是后者的话, ``[[GET]]``操作的返回值为``undefined``。
  
  使用``for...in``遍历对象时原理和查找``[[Prototype]]``链类似, 任何可以通过``[[Prototype]]``链访问到并且是``enumerable``的属性都会被枚举。使用 ``in``操作符时同样会查找完整的原型链(无论是否为``enumerable``)。
  
   ```javascript
  const sourceObj = {
      a: 'hello prototype'
  };
  //创建一个关联到sourceObj的对象
  const targetObj = Object.create(sourceObj);
  
  for(let key in targetObj){
      console.log('key:' + key); //key: a
  }
  Object.defineProperty(myObj, 'a', {
      enumerable: false,
  });
  ('a' in targetObj)  //true
  ```
  
### Object.prototype

  所有普通的``[[Prototype]]``链最终都会指向内置的``Object.prototype``。由于所有普通的对象都源于(或者说把``[[Prototype]]``链的顶端设置为``Object.prototype``), 所以会包含JavaScript中一些内置的功能。比如说``toString()``和``valueOf()``。
  
### 属性设置与屏蔽

  给一个对象设置属性并不仅仅是添加一个新属性或者是修改已有的属性值, 现在看一下完整的一个过程:
  ``myObj.bar = 'hello prototype'``

  1. 如果``myObj``中存在普通数据访问属性``bar``, 则会直接修改已有的属性值。
  2. 如果``bar``既存在``myObj``中, 又存在于``myObj``的``[[Prototype]]``链中, 则会发生属性屏蔽, ``myObj``中的``bar``会屏蔽``[[Prototype]]``链上层中的所有``bar``, 因为``myObj.bar``总是会选择原型链中最底层的``bar``。
  3. 如果``bar``不存在于``myObj``中, 也不存在与原型链中, 则会直接添加到``myObj``上。若``bar``不存在于``myObj``中, 但存在与原型链中, 则又有以下几种情况:

* 如果原型链上层中存在普通数据访问属性``bar``, 并且没有被标记为只读(``writable:true``), 那么就会直接在``myObj``中添加``bar``, 它是屏蔽属性。

  ```javascript
    const sourceObj = {
      bar: "2",
    };
    const myObj = Object.create(sourceObj);
    myObj.bar = "345";
    console.log(myObj, sourceObj); //'345', '2'
  ```

* 如果原型链上层中存在``bar``, 且被标记为只读(``writable:false``), 那么便无法在``myObj``中添加``bar``, 如果为严格模式, 代码会抛出一个错误, 非严格模式下, 赋值语句会被跳过。总之, 不会发生屏蔽。

  ```javascript
    const sourceObj = {
      bar: "2",
    };
    Object.defineProperty(sourceObj, "bar", {
      writable: false,
    });
    const myObj = Object.create(sourceObj);

    myObj.bar = "345";
    console.log(myObj.bar, sourceObj.bar); //'2', '2'
  ```

* 如果原型链上层中存在``bar``, 且为一个``setter``, 那么会调用这个``setter``, 不会添加在``myObj``上,也不会重新定义这个``setter``, 即不会发生屏蔽。

  ```javascript
   const sourceObj = {
      set bar(val) {
        console.log("bar setter");
        this._val_ = val;
      },
    };

    const myObj = Object.create(sourceObj);
    myObj.bar = 2; // bar setter
    console.log(myObj.bar); // undefined
  ```

  如果希望在第二种和第三种中也屏蔽原型链上的``bar``, 就不能通过 ``=`` 操作符来赋值, 而是使用``Object.defineProperty``来添加。

### ’类‘

  ``JavaScript``和面向类的语言不同, 它没有类来作为对象的抽象模式。``JavaScript``只有对象。
  实际上, ``JavaScript``才是真正应该被称为‘面向对象’的语言, 因为它是少有的可以不通过类直接创造对象的语言。

### 类函数

  ``JavaScript``中一直有一种无耻的行为被滥用, 那就是**模仿类**。
  这种奇怪的行为利用了函数的一种特殊性:所有函数都会拥有一个名为prototype的公有并且不可枚举的属性, 它会指向另一个对象。

  ```javascript
    function Bar() {}
    Bar.prototype;
  ```

  这个对象通常被称为``Bar``的原型。这个对象到底是什么?
  最直接的解释就是, 这个对象是在调用 ``new Bar()``时创建的, 最后会被关联到``Bar.prototype``这个对象上。

  ```javascript
  function Bar() {}
  const bar = new Bar();
  Object.getPrototypeOf(bar) === Bar.prototype; //true
  ```

  解释一下``javascript``中``new``操作符的作用:

  1. 创建(或者说构造)一个全新的对象。
  2. 这个对象会被执行原型链接。
  3. 这个对象会绑定到函数调用的``this``。
  4. 如果函数没有返回其他对象, 那么 ``new`` 表达式中的函数调用会自动返回这个新对象。
  
  ```javascript
  function myNew(Bar, ...args) { 
    const obj = {};
    Object.setPrototypeOf(obj, Bar.prototype);
    let result = Bar.apply(obj, args);
    return result instanceof Object ? result : obj 
  }
  ```

  在面向类的语言中, 类可以被实例化多次, 就像用模具制作东西一样。之所以为这样是因为实例化(或继承)一个类就意味着**把类的行为复制到物理对象(实例)中去**, 对于每一个新实例来说都会重复这个过程。
  但是在 ``JavaScript``中, 并没有类似的复制机制。我们并不能创建多个实例, 只能创建多个对象, 这些对象的``[[Prototype]]``关联的是同一个对象, 即``Bar.prototype``。但是在默认情况下并不会进行复制, 因此这些对象之间并不会完全失去联系, 它们是互相关联的。
  
### 关于名称

  在``JavaScript``中, 我们并不会将一个对象(类)复制到另一个对象(实例), 只是将它们关联了起来。从视觉角度来讲, ``[[Prototype]]``机制如下:
  
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/40af4f8858ca4b26af4cfe32b4ab7f8e~tplv-k3u1fbpfcp-watermark.image)
  
  这个机制通常被称为**原型继承**。 但是我觉得恰恰是因为这个名称影响了大家对于``JavaScript``机制真实原理的理解。
  继承意味着复制操作, 但``JavaScript``(默认)并不会复制对象属性。相反, ``JavaScript``会在两个对象之间创建一个关联, 这样一个对象就可以通过 **委托** 访问另一个对象的属性和函数。**委托**这个术语可以更加准确的描述``JavaScript``中对象的关联机制。
  
### 构造函数
  
 ```javascript
 function Bar(){
 }
 const bar = new Bar();
 bar.constructor === Bar; //true
 ```

 上述代码很容易让人认为``Bar``是一个构造函数, 因为我们使用 ``new``操作符调用它, 并且创建了一个对象 ``bar``。  
 实际上, ``Bar``与其他一个正常函数没有任何区别, 这里能创建对象仅仅是因为我们使用了``new``操作符, 所以我的理解是 ``JavaScript``中的构造函数是所有带``new``的函数调用。换句话说, 函数不是构造函数, 但是当且仅当使用``new``操作符时, 函数变成了构造函数。

 ``bar.constructor === Bar``很容易让人误解为``bar``有一个指向``Bar``的``constructor``, 但实际上并不是这样的,``bar.constructor``也是委托给了``Bar.prototype.constructor``, 这和构造毫无关系。

 举个栗子:

 ```javascript
  function Bar() {}
  Bar.prototype = {};
  const bar = new Bar();
  console.log(bar.constructor === Bar); //false
  console.log(bar.constructor === Object); //true
 ```

 所以说, 只是因为在函数``Bar``定义时创建了``Bar.prototype``, ``Bar.prototype.constructor``默认是指向``Bar``本身的, 又通过``new``创建的对象的``[[Prototype]]``会指向``Bar.prototype``, 可是当``Bar.prototype``的引用发生改变时, 便不能保证``bar.constructor === Bar``, 即使``bar``是通过
``Bar new``出来的一个对象, 所以说``bar.constructor``是一个不可靠且不安全的引用。

### 原型继承

下面这段代码就是典型的原型风格。

```javascript
 function Foo(name) {
   this.name = name;
 }
 Foo.prototype.getName = function () {
   return this.name;
 };
 function Bar(name, label) {
   Foo.call(this, name);
   this.label = label;
 }
 Bar.prototype = Object.create(Foo.prototype);

 Bar.prototype.getLabel = function () {
   return this.label;
 };

 const a = new Bar("a", "obj a");
 a.getLabel(); // "obj a"
 a.getName(); // "a"
```

这段代码的核心是 `` Bar.prototype = Object.create(Foo.prototype) ``, 调用``Object.create(...)``会凭空创建一个新对象, 并把新对象内部的``[[Prototype]]``关联到你指定的对象, 换句话说, 这条语句的意思就是 **创建一个新的Bar.prototype对象, 并把它关联到Foo.prototype**。

注意, 下面这两种方式是常见的错误做法, 实际上它们都存在一些问题:

``Bar.prototype = Foo.prototype``

``Bar.prototype = new Foo()``

  ``Bar.prototype = Foo.prototype`` 并不会创建一个关联到``Bar.prototype``的新对象, 它只是让``Bar.prototype``直接引用``Foo.prototype``对象。因此当你执行类似``Bar.prototype.getLabel = ...``赋值语句的时候会直接修改``Foo.prototype``本身。显然这不是你想要的结果, 否则你根本不需要``Bar``对象, 直接使用``Foo``就行了, 这样代码也更简单一些。
  ``Bar.prototype = new Foo()`` 的确会创建一个关联到``Bar.prototype``的新对象。但是它使用了``Foo``的构造函数调用, 如果函数``Foo``有一些副作用的话, 就会影响到``Bar()``的后代, 后果不堪设想。

### 检查类关系

检查一个实例(``JavaScript``的对象)的继承祖先(``JavaScript``中的委托关联)通常被称为**内审(或者反射)**。

```javascript
  function Bar(){}
  Bar.prototype.name = 'Bar' ;
 
  const bar = new Bar();
```

我们如何通过内审找到``bar``的委托关联呢?第一种方法是站在"类"的角度来判断:
``bar instanceof Bar``
``instanceof``操作符的左操作数是一个普通的对象, 右操作数是一个函数。``instanceof``回答的问题是:在``bar``的整条原型链中是否有指向``Bar.prototype``的对象。

如果是使用``bind``生成的硬绑定函数, 该函数是没有``prototype``属性的。在这样的函数上使用``instanceof``的话, 目标函数的``prototype``会代替硬绑定函数的``prototype``。

```javascript
    function Bar(name) {
      this.name = name;
    }

    const obj = {};
    const Baz = Bar.bind(obj);
    console.log(Baz.prototype); //undefined
```

判断两个对象之间是否通过原型链关联:
``a.inPrototypeOf(b)``

我们也可以直接获取一个对象的原型链。在ES5中的标准方法是:
``Object.getPrototypeOf(bar)``
可以验证下这个对象是否和我们想的一样:
``Object.getPrototypeOf(bar) === Bar.prototype`` ``// true``

绝大多数浏览器(并不是所有)也支持一种非标准的方法来访问:
``bar.__proto__ === Bar.prototype``

``.__proto__``的大致实现:

```javascript
    Object.definePrototype(Object.prototype, '__proto__', {
      get: function(){
        return Object.getPrototypeOf(this);
      },
      set: function(o){
          Object.setPrototypeOf(this, o);
          return o;
      }
    })
```

### 对象关联

``[[Prototype]]``机制就是存在于对象中的一个内部链接, 它会引用其他对象。
通常来说, 这个链接的作用时: 如果在对象上没有找到需要的属性或者方法引用, 引擎就会继续在``[[Prototype]]``关联的对象上进行查找。同理, 如果在后者中也没有找到需要的引用就会继续查找它的``[[Prototype]]``, 以此类推。这一系列对象的链接被称为**原型链**。

### 创建关联

```javascript
const foo = {
  something: function(){
    console.log('tell me something...')
  }
};
const bar = Object.create(foo);
bar.something(); // 'tell me something...'
```

``Object.create(..)``会创建一个新对象``bar``并把它关联到我们制定的对象``foo``, 这样我们就可以充分发挥``[[Prototype]]``机制的威力(委托)并且避免不必要的麻烦(比如使用``new``的构造函数调用会生成``prototype``和``constructor``引用)。

``Object.create(null)``会创建一个拥有空(或者``null``)``[[Prototype]]``链接的对象, 这个对象无法进行委托。由于这个对象没有原型链, 所以``instanceof``操作符无法进行判断, 因此总是为返回``false``。这些特殊的空``[[Prototype]]``对象通常被称作**字典**, 它们完全不会受到原型链的干扰, 因此非常适合用来存储数据。

### 关联关系是备用

看起来对象之前的关联关系是用来处理缺失属性或者方法时的一种备用选项。这个说法有点道理, 但是我认为这并不是
``[[Prototype]]``的本质。

```javascript
const foo = {
  something: function(){
    console.log('tell me something...')
  }
};
const bar = Object.create(foo);
bar.something(); // 'tell me something...'
```

虽然这段代码可以正常工作。但是如果你这么写只是为了让``bar``在无法处理属性或者方法时可以使用备用的``foo``, 那么这段代码后续就会很难理解和维护。

  ```javascript
const foo = {
  something: function(){
    console.log('tell me something...')
  }
};
const bar = Object.create(foo);
bar.something = function(){
  this.something();
}
bar.something(); // 'tell me something...'
```

这里我们调用的``bar.something()``实际是存在于``bar``中的, 这可以让我们的``API``设计的更加清晰, 不那么的神奇。从内部来说, 我们实现遵循的是**委托设计模式**。

## 总结

如果要访问对象中并不存在的一个属性, ``[[Get]]``操作就会查找对象内部``[[Prototype]]``关联的对象。这个关联关系世纪上定义了一条 **原型链**, 在查找属性是会对它进行遍历。

所有普通对象都会有内置的``__proto__``, 指向原型链的顶端,如果在原型链中找不到制定的属性就会停止。一些通用的方法存在于``Object.prototype``上, 所以所有对象都可以使用它们。

关联两个对象最常用的方法时使用``new``关键字进行函数调用, 在调用的4个步骤走中会创建一个关联其他对象的新对象。

使用``new``调用函数时会把新对象的``prototype``属性关联到其他对象。带``new``的函数调用通常被称为构造函数调用, 尽管它们实际上和传统面向类语言中的类构造函数不一样。

虽然这些``JavaScript``机制和传统面向类语言中的类初始化和类继承很相似, 但是``JavaScript``中的机制有一个核心区别, 那就是不会进行复制, 对象之间是通过内部的原型链项=相关联的。

出于各种原因, 以继承结尾的术语和其他面向对象的术语都无法帮助你理解``JavaScript``的真实机制。

相比之下, **委托**是一个更适合的术语, 因为对象之间的关系不是复制而是委托。

**本文内容仅为个人学习时所做笔记, 文章内容参考与《你不知道的JavaScript》。**
