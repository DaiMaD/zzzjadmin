<template>
  <div class="table">
    <div class="container">
      <div class="headbtn">
        <el-button type="primary" @click="addOneMenu" class="addbtn">添加一级菜单</el-button>
      </div>

      <el-tree :data="list" node-key="id" ref="tree" highlight-current :props="defaultProps"
        @check-change="changeSelectTree" :expand-on-click-node="false" :render-content="renderContent">
      </el-tree>

      <!--新增子路由弹框-->
      <div class="categories-news" v-if="this.addFormVisible">
        <div class="categories-news-main">
          <div class="categories-news-title">
            <i class="iconfont icon-msnui-close-fat" @click="addFormVisible = false"></i>
          </div>
          <div class="categories-news-content">
            <el-form :model="addForm" ref="addForm" label-position="left" label-width="100px">
              <el-form-item label="菜单标题:" prop="title">
                <el-input v-model="addForm.title"></el-input>
              </el-form-item>

              <el-form-item label="菜单映射组件:" prop="index">
                <el-input v-model="addForm.index"></el-input>
              </el-form-item>

              <el-form-item label="菜单类型:" prop="menu_type">
                <el-select v-model="addForm.menu_type">
                  <el-option v-for="item in menuType" :key="item.value" :label="item.label" :value="item.value">
                    <i :class="item.icon"></i>
                    <span>{{ item.label }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="icon:" prop="icon">
                <el-select v-model="addForm.icon">
                  <el-option v-for="item in iconType" :key="item.value" :label="item.label" :value="item.value">
                    <i :class="item.value"></i>
                    <span>{{ item.label }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="categories-news-button">
            <button @click="confirmAdd">确定</button>
            <button @click="addFormVisible = false">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { getRouteTree, postMenu, DelMenu, putMenu } from '../../../../api/api';
  export default {
    data() {
      let id = 1000;
      return {
        isAdd: false,//判断是新增弹框还是编辑弹框
        addFormVisible: false,//新增路由弹框是否展示
        putId: 0,//当前修改的路由的id
        defaultProps: {
          children: 'subs',
          label: 'title'
        },
        list: [],//初始路由数据
        addForm: {
          parent_menu_id: 0,//上级菜单id
          icon: '',//icon
          index: '',//路由地址  例如：FMlist
          title: '',//菜单标题
          menu_type: '',//菜单类型（1 一级菜单 2 二级菜单 3 三级菜单 4四级菜单......）
        },
        menuType: [
          {
            value: 1,
            label: '一级菜单'
          },
          {
            value: 2,
            label: '二级菜单'
          },
          {
            value: 3,
            label: '三级菜单'
          },
          {
            value: 4,
            label: '四级菜单'
          }
        ],
        iconType: [
          {
            value: 'el-icon-edit-outline',
            label: 'el-icon-edit-outline'
          },
          {
            value: 'el-icon-date',
            label: 'el-icon-date'
          },
          {
            value: 'el-icon-question',
            label: 'el-icon-question'
          },
          {
            value: 'el-icon-tickets',
            label: 'el-icon-tickets'
          },
          {
            value: 'el-icon-phone',
            label: 'el-icon-phone'
          },
          {
            value: 'el-icon-edit',
            label: 'el-icon-edit'
          },
          {
            value: 'el-icon-star-on',
            label: 'el-icon-star-on'
          },
          {
            value: 'el-icon-rank',
            label: 'el-icon-rank'
          },
          {
            value: 'el-icon-warning',
            label: 'el-icon-warning'
          }
        ]
      }
    },
    created() {
      this.getData();
    },
    computed: {},

    methods: {
      //获取当前数据，并利用del_list进行深复制(防止公用地址,而造成的数据同步修改)
      async getData() {
        await getRouteTree().then(res => {
          console.log(res);
          if (!res.data || res.data === [] || res.data.length === 0) {
            if (this.cur_page - 1 > 0) {
              this.cur_page -= 1
              this.getData()
            } else {
              this.list = []
            }
          } else {
            this.list = res.data;
            console.log(this.list)
          }
        });
      },
      changeSelectTree() {
        // this.setRightData.menuids = this.$refs.tree.getCheckedKeys().join(',')
        console.log(this.$refs.tree.getCheckedKeys())
      },
      //添加一级菜单
      addOneMenu() {
        this.addForm = {
          parent_menu_id: 0,
          icon: '',
          index: '',
          title: '',
          menu_type: 1
        }
        this.addFormVisible = true;
      },
      append(node, data, store) {
        // console.log(node, data, store)
        this.isAdd = true;
        this.addForm = {
          parent_menu_id: data.id,
          icon: '',
          index: '',
          title: '',
          menu_type: ''
        }
        this.addFormVisible = true;
      },
      editMenu(node, data, store) {
        // console.log(node, data, store)
        this.isAdd = false;
        this.addForm = {
          parent_menu_id: data.parent_menu_id,
          icon: data.icon,
          index: data.index,
          title: data.title,
          menu_type: data.menu_type
        }
        this.putId = data.id;
        this.addFormVisible = true;
      },
      remove(node, data) {
        this.$confirm('此操作将永久删除该路由, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: "btn-custom-cancel",
          type: 'warning'
        }).then(() => {
          DelMenu(data.id).then((res) => {
            if (res.success === true) {
              this.getData();
            }
          });
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      renderContent(h, { node, data, store }) {
        return (
          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
            <span>
              <span>{node.label}</span>
            </span>
            <span>
              <el-button style="font-size: 14px;" type="text" on-click={() => this.editMenu(node, data, store)}>编辑修改</el-button>
              <el-button style="font-size: 14px;" type="text" on-click={() => this.append(node, data, store)}>添加子项</el-button>
              <el-button style="font-size: 14px;" type="text" on-click={() => this.remove(node, data)}>删除</el-button>
            </span>
          </span>);
      },
      confirmAdd() {
        console.log(this.addForm)
        if (this.isAdd == true) {
          postMenu(this.addForm).then(res => {
            this.getData()
          })
          this.addFormVisible = false;
        } else if (this.isAdd == false) {
          putMenu(this.putId, this.addForm).then(res => {
            this.getData()
          })
          this.addFormVisible = false;
        }

      }
    }
  }
</script>

<style scoped>
  .headbtn {
    height: 40px;
    position: relative;
  }

  .addbtn {
    position: absolute;
    right: 10px;
  }
</style>