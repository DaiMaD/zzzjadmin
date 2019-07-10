<template>
  <div class="table">
    <div class="container">
      <el-row :gutter="20">
        <el-col :span="6" v-for="allRole in roleData" :key="allRole.role_Name">
          <div class="lvlist">
            <i :class="allRole.icon"></i>
            <p class="lvtitle">{{allRole.role_name}}</p>
            <div class="lvtext">{{allRole.role_info}}</div>
            <p class="roleSettings" @click="setRoleSettings(allRole.id)"><i class="el-icon-setting"></i><span>
                设置权限</span></p>
            <div class="lvbtn">
              <el-button size="small" @click="handleAddRole(allRole)">创建账号</el-button>
              <el-button size="small" @click="seeuser(allRole)">查看账户</el-button>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="lvlist">
            <i class="el-icon-phone icons"></i>
            <p class="lvtitle">自定义角色</p>
            <div class="lvtext">自定义角色，自由配置角色权限</div>
            <div class="lvbtn">
              <el-button size="small" @click="addRoleBtn()">创建角色</el-button>
              <el-button size="small" @click="seeRoleList()">角色列表</el-button>
            </div>
          </div>
        </el-col>
      </el-row>

      <!--新增账号弹框-->
      <div class="categories-news" v-if="this.addFormVisible">
        <div class="categories-news-main">
          <div class="categories-news-title">
            <span>{{this.isEditForm?'修改':'新增'}}</span>
            <i class="iconfont icon-msnui-close-fat" @click="addFormVisible = false"></i>
          </div>
          <div class="categories-news-content">
            <el-form :model="addForm" :rules="addFormRules" ref="addForm" label-position="left" label-width="100px">
              <el-form-item label="用户名:" prop="name">
                <el-input v-model="addForm.name"></el-input>
              </el-form-item>

              <el-form-item label="密码:" prop="password">
                <el-input v-model="addForm.password"></el-input>
              </el-form-item>

              <el-form-item label="状态:" prop="status">
                <el-select v-model="addForm.status">
                  <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
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

      <!--账号详情弹框-->
      <div class="categories-news" v-if="this.addFormVisible2">
        <div class="categories-news-main">
          <div class="categories-news-title">
            <i class="iconfont icon-msnui-close-fat" @click="addFormVisible2 = false"></i>
          </div>
          <div class="categories-news-content">
            <div class="handle-box">
              <el-button type="primary" icon="delete" class="handle-del mr10" @click="batchDelete">批量删除</el-button>
              <el-input size="medium" v-model="select_cate" placeholder="请输入查询ID" class="handle-select mr10" clearable>
              </el-input>
              <el-button type="primary" icon="search" @click="search">搜索</el-button>
              <el-button type="primary" icon="add" @click="handleAdd">新增</el-button>
            </div>
            <el-table :data="list" border max-height="400" style="width: 100%" ref="multipleTable"
              @selection-change="handleSelectionChange" stripe
              :header-cell-style="{color:'#000',font_weight:800,background:'#ccc'}">
              <el-table-column type="selection" width="55" fixed></el-table-column>
              <el-table-column prop="id" label="后台管理员" min-width="100"></el-table-column>
              <el-table-column prop="name" label="用户名" min-width="100"></el-table-column>
              <el-table-column prop="password" label="密码" min-width="100"></el-table-column>
              <el-table-column prop="status" label="状态" min-width="100" :formatter="formatStatus"></el-table-column>
              <el-table-column prop="create_time" label="创建时间" min-width="200" :formatter="formatTime">
              </el-table-column>
              <el-table-column prop="update_time" label="修改时间" min-width="200" :formatter="formatTime">
              </el-table-column>
              <el-table-column label="操作" width="180" fixed="right">
                <template slot-scope="scope">
                  <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="myDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--分页-->
            <div class="pagination">
              <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="this.total">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>

      <!-- 新增角色弹框 -->
      <div class="categories-news" v-if="this.addRole">
        <div class="categories-news-main">
          <div class="categories-news-title">
            <span>{{this.isEditForm?'修改':'新增'}}</span>
            <i class="iconfont icon-msnui-close-fat" @click="addRole = false"></i>
          </div>
          <div class="categories-news-content">
            <el-form :model="roleFrom" :rules="addFormRules" ref="addForm" label-position="left" label-width="100px">
              <el-form-item label="角色名:" prop="role_name">
                <el-input v-model="roleFrom.role_name"></el-input>
              </el-form-item>
              <el-form-item label="状态:" prop="status">
                <el-select v-model="roleFrom.status">
                  <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <div class="buttons">
                <el-button @click="getCheckedKeys">通过 key 获取</el-button>
                <el-button @click="resetChecked">清空</el-button>
              </div>
            </el-form>
          </div>
          <div class="categories-news-button">
            <button @click="addRoleConfirm">确定</button>
            <button @click="addRole = false">取消</button>
          </div>
        </div>
      </div>


      <!-- 角色列表 -->
      <div class="categories-news" v-if="this.addRole2">
        <div class="categories-news-main">
          <div class="categories-news-title">
            <i class="iconfont icon-msnui-close-fat" @click="addRole2 = false"></i>
          </div>
          <div class="categories-news-content">
            <div class="handle-box">
              <el-button type="primary" icon="delete" class="handle-del mr10" @click="batchDelete">批量删除</el-button>
              <el-input size="medium" v-model="select_cate" placeholder="请输入查询ID" class="handle-select mr10" clearable>
              </el-input>
              <el-button type="primary" icon="search" @click="search">搜索</el-button>
              <el-button type="primary" icon="add" @click="addRoleBtn">新增</el-button>
            </div>
            <el-table :data="roleData" border max-height="400" style="width: 100%" ref="multipleTable"
              @selection-change="handleSelectionChange" stripe
              :header-cell-style="{color:'#000',font_weight:800,background:'#ccc'}">
              <el-table-column type="selection" width="55" fixed></el-table-column>
              <el-table-column prop="role_name" label="角色名称" min-width="100"></el-table-column>
              <el-table-column prop="status" label="状态" min-width="100" :formatter="formatStatus"></el-table-column>
              </el-table-column>
              <el-table-column label="操作" width="180" fixed="right">
                <template slot-scope="scope">
                  <el-button size="small" @click="editRoles(scope.$index, scope.row)">编辑</el-button>
                  <el-button size="small" type="danger" @click="deleteRoles(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!--分页-->
            <div class="pagination">
              <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="this.total">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>


      <!-- 角色路由设置 -->
      <div class="categories-news" v-if="this.roleSettings">
        <div class="categories-news-main">
          <div class="categories-news-title">
            <i class="iconfont icon-msnui-close-fat" @click="roleSettings = false"></i>
          </div>
          <div class="categories-news-content">
            <el-tree :data="data2" show-checkbox node-key="id" ref="tree" highlight-current :props="defaultProps"
              :default-checked-keys="resourceCheckedKey" @check-change="changeSelectTree">
            </el-tree>
            <div class="buttons">
              <el-button @click="getkeys">通过 key 获取</el-button>
              <el-button @click="resetChecked">清空</el-button>
            </div>
          </div>
          <div class="categories-news-button">
            <button @click="setRoleSettings_confirm()">确定</button>
            <button @click="roleSettings = false">取消</button>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script>
  // import Treeselect from '@riophae/vue-treeselect'
  // import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {
    getAdministrator,
    getAdministratorOne,
    deleteAdministratorOne,
    postAdministrator,
    putAdministrator,
    postAdministratorList,
    getRouteTree,
    getAllRole,
    postRole,
    deleteRole,
    putRole,
    setRight,
    getRight,
    getByRoleid
  } from '../../../../api/api'
  import { formatDate } from '../../../Utility/Utility'

  export default {
    components: {
      // Treeselect
    },
    data() {
      var validateName = (rule, value, callback) => {
        if (/^[a-zA-Z][a-zA-Z0-9]{4,7}$/.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的登录名,5-8位英文字母大小写和数字组合'))
        }
      }
      var validatePassword = (rule, value, callback) => {
        if (/^.{4,9}$/.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的登录密码,5-10位任意字符'))
        }
      }

      return {
        select_cate: '', //查询id
        list: [], //数据
        del_list: [], //查询时缓存的全部数据
        cur_page: 1, //当前页
        total: 0,
        size: 10,
        value: [],
        yijiRoute: ['1'],
        isAddRole: true,
        addFormVisible: false,//新增账号界面是否显示
        addFormVisible2: false,//控制是否显示账号信息列表
        addRole: false,//新增角色界面是否显示
        addRole2: false,//控制是否显示角色信息列表
        roleData: [],//角色列表data，两个地方使用：1.展示所有可创建角色 2.在自定义角色里查看所有角色
        roleSettings: false,//权限设置页面是否展示
        resourceCheckedKey: [],//设置默认选中的树节点
        //名称不能为空
        addFormRules: {
          name: [
            { required: true, message: '名称字段不能为空' },
            { validator: validateName, trigger: 'blur' }
          ],
          password: [
            {
              required: true,
              message: '密码不能为空'
            },
            {
              validator: validatePassword,
              trigger: 'blur'
            }
          ]
        },
        //新增界面数据
        addForm: {
          name: '',
          password: '',
          status: 0,
          routes: []
        },
        roleFrom: {
          role_name: '',
          status: 0
        },
        setRightData: {
          roleid: 0,
          menuids: ''
        },
        accountType: '',
        options: [], //  时间选择器

        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          }
        },

        isEditForm: false, //是否是编辑页面

        statusOptions: [
          {
            value: 0,
            label: '不可用'
          },
          {
            value: 1,
            label: '可用'
          }
        ],

        data2: [],
        defaultProps: {
          children: 'subs',
          label: 'title'
        },
        normalizer(node) {
          return {
            id: node.id,
            label: node.title,
            children: node.subs
          }
        }
      }
    },
    created() {
      this.getData()
      getRouteTree().then(res => {
        this.data2 = res.data//获取树形菜单的数据
        console.log(res)
      })
    },
    computed: {},
    methods: {
      getkeys() {
        // console.log(this.$refs.tree.getCheckedKeys())
        var aKey = this.getCheckedKeys(this.data2, this.$refs.tree.getCheckedKeys(), 'id');
        console.log(aKey);
      },
      getCheckedKeys(data, keys, key) {
        var res = [];
        recursion(data, false);
        return res;

        // arr -> 树形总数据
        // keys -> getCheckedKeys获取到的选中key值
        // isChild -> 用来判断是否是子节点
        function recursion(arr, isChild) {
          var aCheck = [];
          for (var i = 0; i < arr.length; i++) {
            var obj = arr[i];
            aCheck[i] = false;

            if (obj.subs) {
              aCheck[i] = recursion(obj.subs, true) ? true : aCheck[i];
              if (aCheck[i]) {
                res.push(obj[key]);
              }
            }

            for (var j = 0; j < keys.length; j++) {
              if (obj[key] == keys[j]) {
                aCheck[i] = true;
                if (res.indexOf(obj[key]) == -1) {
                  res.push(obj[key]);
                }
                break;
              }
            }
          }
          if (isChild) {
            return aCheck.indexOf(true) != -1;
          }
        }
      },
      resetChecked() {
        this.$refs.tree.setCheckedKeys([])
      },
      formatStatus: function (row, column, cellValue) {
        if (cellValue === 0) {
          return '不可用'
        } else {
          return '可用'
        }
      },
      //时间
      formatTime: function (row, column, cellValue) {
        return formatDate(cellValue)
      },
      //获取当前数据，并利用del_list进行深复制(防止公用地址,而造成的数据同步修改)
      async getData() {
        await getAllRole().then(res => {
          if (
            !res.data.data ||
            res.data.data == [] ||
            res.data.data.length == 0
          ) {
            if (this.cur_page - 1 > 0) {
              this.cur_page -= 1
              this.getData()
            } else {
              this.list = []
            }
          } else {
            this.roleData = res.data.data
            if (res.data.totalPages) {
              this.total = res.data.totalPages * 10
            }
          }
        })
        this.del_list = JSON.parse(JSON.stringify(this.list))
      },
      //分页导航
      handleCurrentChange(val) {
        this.cur_page = val
        this.getData()
      },

      //搜索
      search() {
        if (this.select_cate !== '') {
          getAdministratorOne(parseInt(this.select_cate)).then(res => {
            if (res.data == null) {
              this.list = null
            } else {
              this.list = JSON.parse(JSON.stringify(this.del_list))
              this.list.splice(0, this.list.length, res.data)
            }
          })
        } else {
          this.list = JSON.parse(JSON.stringify(this.del_list))
        }
      },

      //删除
      myDelete(index, row) {
        // 新增删除提示
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'btn-custom-cancel',
          type: 'warning'
        })
          .then(() => {
            deleteAdministratorOne(row.id).then(res => {
              if (res.success === true) {
                this.select_cate = ''
                this.getData()
              }
            })
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      },
      //批量删除
      batchDelete() {
        let str = ''
        this.multipleSelection.forEach((selection, index) => {
          str += `${selection.id},`
        })
        if (str.endsWith(',')) {
          str = str.slice(0, -1)
        }

        postAdministratorList(str).then(res => {
          if (res.success === true) {
            this.getData()
          }
        })
      },

      //点击选中被删除项
      handleSelectionChange(val) {
        this.multipleSelection = val
      },

      seeRoleList() {
        this.addRole2 = true
      },
      //新增弹框显示
      handleAdd() {
        this.select_cate = ''
        this.isEditForm = false
        this.addForm = {
          name: '',
          password: '',
          status: 0,
          routes: []
        }
        this.addFormVisible2 = false
        this.addFormVisible = true
      },
      //新增自定义角色
      addRoleBtn() {
        this.addRole2 = false;
        this.isAddRole = true;
        this.select_cate = ''
        this.isEditForm = false
        this.accountType = 4
        this.roleFrom = {
          role_name: '',
          status: ''
        }
        this.addRole = true
      },
      //修改角色
      editRoles(index, row) {
        console.log(row)
        this.addRole2 = false;
        this.isAddRole = false;
        this.roleFrom = {
          role_name: row.role_name,
          status: row.status,
          id: row.id
        }
        this.addRole = true;
      },
      //新增\修改角色的确认按钮
      addRoleConfirm() {
        if (this.isAddRole == true) {
          postRole(this.roleFrom).then(res => {
            this.getData()
          })
        } else {
          putRole(this.roleFrom, this.roleFrom.id).then(res => {
            this.getData();
          })
        }
        this.addRole = false
      },
      // 删除角色
      deleteRoles(index, row) {
        deleteRole(row.id).then(res => {
          this.getData();
        })
      },
      // 设置角色权限点击按钮
      setRoleSettings(rowid) {
        getRight(rowid).then(res => {
          console.log(res.data)
          this.$refs.tree.setCheckedKeys([9, 8, 1]);
        })
        this.setRightData.roleid = rowid;
        this.roleSettings = true;
      },
      // 树形菜单选择项改变触发
      changeSelectTree() {
        // this.setRightData.menuids = this.$refs.tree.getCheckedKeys().join(',')
        this.setRightData.menuids = this.getCheckedKeys(this.data2, this.$refs.tree.getCheckedKeys(), 'id').join(',');
        console.log(this.setRightData.menuids)
      },
      // 设置角色权限确定按钮
      setRoleSettings_confirm() {
        console.log(this.setRightData)
        setRight(this.setRightData).then(res => {
          console.log('设置成功')
        })
        this.roleSettings = false;
      },

      // 新增角色下账户点击按钮 弹框
      handleAddRole(row) {
        this.addForm = {
          name: '',
          password: '',
          status: 0,
          role_id: row.id
        }
        this.addFormVisible = true
      },
      //新增角色下帐号确认按钮
      confirmAdd() {
        this.$refs['addForm'].validate(valid => {
          //TODO: 这里进行角色下创建账号请求
          console.log(this.addForm)
          postAdministrator(this.addForm).then(res => {
            console.log('新增帐号成功')
            this.addFormVisible = false
          })
        })
      },
      //查看角色下帐号点击按钮 弹框
      seeuser(row) {
        this.addFormVisible2 = true
        getByRoleid(row.id).then(res => {
          this.list = res.data
          console.log(res);
        })
      },



      //编辑按钮点击
      handleEdit(index, row) {
        console.log(row.status)
        this.isEditForm = true
        this.addForm = {
          id: row.id,
          name: row.name,
          password: row.password,
          status: row.status
        }
        this.addFormVisible = true
      },

      //修改
      myPutAdministratorChange() {
        putAdministrator(this.addForm, this.addForm.id).then(res => {
          if (res.success === true) {
            this.addFormVisible = false
            this.getData()
          } else {
            this.$message({
              message: res.data,
              type: 'error'
            })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .table {
    height: 500px !important;
  }

  .container {
    height: 850px !important;
  }

  .lvlist {
    height: 220px;
    border: 1px solid #ccc;
    margin-top: 20px;
    padding: 0 50px;
    text-align: center;
    padding-top: 20%;
    position: relative;
  }

  .lvtitle {
    text-align: center;
    margin-top: 8%;
  }

  .roleSettings {
    position: absolute;
    top: 10%;
    right: 5%;
    cursor: pointer;
  }

  .lvtext {
    color: #666;
    font-size: 12px;
    margin: 10px 0;
  }

  .lvbtn {
    width: 100%;
    position: absolute;
    bottom: 8%;
    left: 50%;
    transform: translateX(-50%);
  }

  .icons {
    font-size: 22px;
  }
</style>