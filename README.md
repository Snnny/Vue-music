# vue-music

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

### tip

#### fastclick点击与better-scroll单击事件冲突
```javascript
// better-scroll在需要点击的元素添加needsclick的类名
<img class="needsclick" :src="item.picUrl"/>
```
