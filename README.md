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





admin管理2接口：
新增角色下账户：postAdministrator，在data中新增角色id字段 role_id
新增角色：/admin/setRight


创建角色/账号到登录的流程:
  1.在角色下创建账号,如果没有角色,首先创建角色,角色可在角色列表内增删查改;
  2.创建完账号后,可配置整个角色的路由权限,可查看角色下的所有账户,设置某个账号可用不可用,增删查改某个账号;
  3.角色下帐号创建完成后,即可登录,在登录页面登录帐号
  4.登录账号前,向后台请求完整的项目路由,先在页面展示所有的路由(后端返回所有的路由树,需要用哪个取哪个,现"内容管理"已完善)
  5.根据登录的帐号向后台请求路由ID数组,有权限的路由ID保留,无权限的路由ID通过"remove"删除,在文档移除
  6.这样就只能看见当前账号拥有的权限路由




***************************8
1.角色下创建帐号,然后查看此角色下全部帐号并没有新创建的账号
2.登录时获取当前账号权限数组,然后相应的显示路由