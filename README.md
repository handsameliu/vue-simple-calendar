# vue-simple-calendar

> simple calendar

## Installation

#### NPM
```bash
npm install vue-simple-calendar-zh --save
```

```javascript
import simpleCalendar from 'vue-simple-calendar-zh'

Vue.use(simpleCalendar);
```

| Item      |    Value | Qty  |
| :-------- | --------:| :--: |
|:parentTime|`2017/11/11`|'yyyy/MM/dd'|
|@getQueryByDate|function name|function|

适用于`vue2.0` 注意是`REM布局`，其他布局可能会失效。适配iphone6。

1、':parentTime'      默认显示的日期，String类型，也可以不传（默认当天），格式为yyyy/MM/dd

2、'@getQueryByDate'  点击后的回调方法（父组件定义）。返回点击的时间

初始化 init

![avatar](http://olrrovutt.bkt.clouddn.com/20171115162646.jpg)

点击 click

![avatar](http://olrrovutt.bkt.clouddn.com/20171115162733.jpg)

下一页 next

![avatar](http://olrrovutt.bkt.clouddn.com/20171115163216.jpg)

具体方法详情可查看目录中的index.html Configuration details

![avatar](http://olrrovutt.bkt.clouddn.com/20171117141942.jpg)

![avatar](http://olrrovutt.bkt.clouddn.com/20171116162212.jpg)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```

For detailed explanation on how things work, consult the [docs for vue-loader](http://vuejs.github.io/vue-loader).
