#### 首先你得知道这些东西

##### resize事件
```
resize事件: 事件会在窗口或框架被调整大小时发生
```

##### 当前获得焦点的元素
```
document.activeElement.tagName
```
##### 让当前的元素滚动到浏览器窗口的可视区域内
```
Element.scrollIntoView()
```

ios软键盘出现时，input会自行调整位置，因此需要调整Android环境下的问题，最终解决方法：

```
if (/Android/gi.test(navigator.userAgent)) {
  window.addEventListener('resize', function () {
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
      window.setTimeout(function () {
        document.activeElement.scrollIntoViewIfNeeded();
      }, 0);
    }
  })
}
```
input父元素div可能需要添加样式transform: translateZ(0);


