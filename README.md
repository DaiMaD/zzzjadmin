# zhenzhizhuojian

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

快捷键打开新增bug
我理解的：监听键盘事件的js在vue的creat生命周期函数内，在刚进入一个页面a时会触发create事件，这时监听事件是管用的；
如果新打开一个页面b，然后后退到a，a没有没重构，create生命周期函数没有被触发，所以没有监听到键盘事件

疑难：如果组件写在tabs标签页里，在一个组件跳转到另一个组件，然后再跳回去，都会触发哪些生命周期函数




路由权限理想方式: 在本地保存全部路由,但不立即初始化Vue应用,待用户登录拿到权限后,用菜单权限筛选出可用路由,再用可用路由初始化Vue应用.也就是说要将登录页独立出去做成一个单独的页面,登录后将用户数据保存在本地,再用URL跳转到Vue应用所在的页面Vue项目启动前通过本地用户数据完成路由筛选,然后初始化Vue应用.
问题在本地用户数据和全部路由列表筛选怎么实现