<template>
  <div class="table">
    <div class="container">
      <div class="handle-box">
        <el-button type="primary" icon="delete" class="handle-del mr10" @click="batchDelete">批量删除</el-button>

        <el-input
          size="medium"
          v-model="mobile"
          placeholder="请输入手机号"
          class="handle-select mr10"
          clearable
        ></el-input>

        <el-button type="primary" icon="search" @click="search">搜索</el-button>

        <el-button type="primary" icon="add" @click="handleAdd" class="addbtn" >新增</el-button>
        <el-button type="info" icon="add" @click="qingchu">清除</el-button>
      </div>

      <el-table
        :data="list"
        border
        max-height="660"
        style="width: 100%"
        ref="multipleTable"
        @selection-change="handleSelectionChange"
        stripe
        highlight-current-row
        :header-cell-style="{color:'#000',font_weight:800,background:'#ccc'}"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="user_type" label="用户类别" width="100" :formatter="formatPartner"></el-table-column>
        <el-table-column prop="name" label="app昵称" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="mobile" label="手机号" width="100"></el-table-column>
        <el-table-column prop="avatar" label="app头像" width="100" :show-overflow-tooltip="true">
        		<template slot-scope="scope">
						<img :src="scope.row.avatar" height="90%" class="touxiang"/>
					</template>
        </el-table-column>
        <el-table-column prop="wxinfo" label="微信头像" width="100" :show-overflow-tooltip="true">
        		<template slot-scope="scope">
						<img :src="item.headimgurl" v-for="(item,index) in scope.row.wxinfo" height="90%" class="touxiang"/>
					</template>
        </el-table-column>
        <el-table-column prop="wxinfo" label="微信昵称" width="100" :show-overflow-tooltip="true">
        		<template slot-scope="scope">
        			<span v-for="(item,index) in scope.row.wxinfo">"{{item.nickname}}",</span>
					</template>
        </el-table-column>
        <el-table-column prop="sex" label="性别" width="100" :formatter="formatSex"></el-table-column>
        <el-table-column prop="birth_day" label="出生日期" width="100"></el-table-column>
        <el-table-column prop="education" label="学历" width="100"></el-table-column>
        <el-table-column prop="industry" label="行业" width="100"></el-table-column>
        <el-table-column prop="position" label="职位" width="100"></el-table-column>
        <el-table-column prop="company" label="公司" width="100"></el-table-column>
        <el-table-column prop="city" label="城市" width="100"></el-table-column>
        <el-table-column prop="zz_coin" label="真知币" width="100"></el-table-column>
        <el-table-column prop="gold_coin" label="金币" width="100"></el-table-column>
        <el-table-column prop="formatPartner" label="下线人数" width="100"></el-table-column>
        <el-table-column prop="status" label="用户状态" width="100" :formatter="formatStatus"></el-table-column>
        <el-table-column prop="my_invite_code" label="邀请码" width="100"></el-table-column>
        <el-table-column prop="parent_invite_code" label="上级邀请码" width="100"></el-table-column>
        <el-table-column prop="my_learning_card" label="我的学习卡编号" width="100"></el-table-column>
        <el-table-column prop="certificationbaominginfo.address_detail" label="详细地址" width="100"></el-table-column>
        <el-table-column prop="certificationbaominginfo.ID_number" label="身份证号" width="100"></el-table-column>
        <el-table-column prop="certificationbaominginfo.photo" label="个人照片" width="100"></el-table-column>
        <el-table-column prop="certificationbaominginfo.ID_photo_handheld" label="手持身份证照片" width="100"></el-table-column>
        <el-table-column prop="certificationbaominginfo.ID_photo_front" label="身份证正面照" width="100"></el-table-column>
        <el-table-column prop="certificationbaominginfo.ID_photo_back" label="身份证反面照" width="100"></el-table-column>
        <el-table-column prop="bind_time" label="绑定上级时间" width="200" :formatter="formatTime"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="200" :formatter="formatTime"></el-table-column>
        <el-table-column prop="update_time" label="更新时间" width="200" :formatter="formatTime"></el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="myDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <div class="pagination">
        <el-pagination
          	background
	        	@size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :page-sizes="[10, 20, 30, 40]"
		      :page-size="10"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="this.total"
        ></el-pagination>
      </div>

      <!--新增弹框-->
      <div class="categories-news" v-if="this.addFormVisible">
        <div class="categories-news-main">
          <div class="categories-news-title">
            <span>{{this.isEditForm?'修改':'新增'}}</span>
            <i class="iconfont icon-msnui-close-fat" @click="addFormVisible = false"></i>
          </div>
          <div class="categories-news-content">
            <el-form
              :model="addForm"
              :rules="addFormRules"
              ref="addForm"
              label-position="left"
              label-width="100px"
            >
              <el-form-item label="用户名:" prop="name">
                <el-input v-model="addForm.name" placeholder="用户名"></el-input>
              </el-form-item>
              <el-form-item label="用户手机号:" prop="mobile">
                <el-input v-model.string="addForm.mobile" placeholder="手机号"></el-input>
              </el-form-item>
              <el-form-item label="性别:" prop="sex">
                <el-input v-model.string="addForm.sex" placeholder="0女 1男 2保密"></el-input>
              </el-form-item>
              <el-form-item label="出生日期:" prop="birth_day">
                <el-input v-model.string="addForm.birth_day" placeholder="生日"></el-input>
              </el-form-item>
              <el-form-item label="学历:" prop="education">
                <el-input v-model.string="addForm.education" placeholder="学历"></el-input>
              </el-form-item>
              <el-form-item label="行业:" prop="industry">
                <el-input v-model.string="addForm.industry" placeholder="行业"></el-input>
              </el-form-item>
              <el-form-item label="职位:" prop="position">
                <el-input v-model.string="addForm.position" placeholder="职位"></el-input>
              </el-form-item>
              <el-form-item label="公司:" prop="company">
                <el-input v-model.string="addForm.company" placeholder="公司"></el-input>
              </el-form-item>
              <el-form-item label="城市:" prop="city">
                <el-input v-model.string="addForm.city" placeholder="城市"></el-input>
              </el-form-item>
              <el-form-item label="头像链接:" prop="avatar">
                <el-input v-model="addForm.avatar"></el-input>
                <el-upload
                  class="upload-demo"
                  :show-file-list="false"
                  action
                  :on-change="handleAvatarSuccess"
                  :auto-upload="false"
                >
                  <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                </el-upload>
              </el-form-item>
              <el-form-item label="用户积分:" prop="bonus_points">
                <el-input v-model="addForm.bonus_points"></el-input>
              </el-form-item>
              <el-form-item label="用户角色:" prop="user_type">
                <el-select v-model="addForm.user_type">
                  <el-option
                    v-for="item in usertypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态:" prop="status">
                <el-select v-model="addForm.status">
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
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

      <!--进度条弹框-->
      <div class="categories-news" v-if="this.progressVisible">
        <el-progress type="circle" :percentage="this.progressPercent" color="#8e71c7"></el-progress>

        <!--<el-button type="primary" class="cancel-upload" @click="open2">取消上传</el-button>-->
      </div>
    </div>
  </div>
</template>

<script>
import {
  getUsers,
  getUsersOne,
  deleteUsersOne,
  postUsers,
  putUsers,
  postUsersList,
  getPicURL,
  getUserInfoByMobile
} from "../../../../api/api";
import {
  formatDate,
  handleCommonAvatarSuccess
} from "../../../Utility/Utility";
export default {
  data() {
    var validateName = (rule, value, callback) => {
      if (/^\s*$/.test(value)) {
        callback(new Error("请输入正确的姓名,不可以是空格"));
      } else {
        callback();
      }
    };
    var validateMobile = (rule, value, callback) => {
      if (/^1\d{10}$/.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的手机号"));
      }
    };

    var validateEmail = (rule, value, callback) => {
      if (/^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的邮箱"));
      }
    };
    return {
      select_cate: "", //查询id
      list: [], //数据
      del_list: [], //查询时缓存的全部数据
      cur_page: 1, //当前页
      total: 0,
      size: 10,
      mobile: "",
      //新增界面是否显示
      addFormVisible: false,

      //进度条是否显示
      progressVisible: false,
      progressPercent: 0,

      //名称不能为空,手机号验证
      addFormRules: {
        name: [
          { required: true, message: "名称字段不能为空" },
          { validator: validateName, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "手机号不能为空" },
          { validator: validateMobile, trigger: "blur" }
        ]
        // email: [
        //   { required: true, message: "邮箱不能为空" },
        //   { validator: validateEmail, trigger: "blur" }
        // ]
      },
      //新增界面数据
      addForm: {
        mobile: "",
        name: "",
        email: "",
        avatar: "",
        bonus_points: "",
        vip_level: 1,
        status: 0,
        user_type: 0,
        sex:'',//  性别 
				birth_day:'',// 出生日期
				education:'',// 学历
				industry:'',// 行业
				position:'',// 职位
				company:'',// 公司
				city:'',// 城市
      },

      isEditForm: false, //是否是编辑页面

      statusOptions: [
        {
          value: 0,
          label: "未激活"
        },
        {
          value: 1,
          label: "正常"
        }
      ],
      usertypeOptions: [
        {
          value: 0,
          label: "总代理"
        },
        {
          value: 1,
          label: "合伙人"
        },
        {
          value: 2,
          label: "普通用户"
        }
      ],
      vipLevelOptions: [
        {
          value: 1,
          label: "普通用户"
        },
        {
          value: 2,
          label: "白银会员"
        },
        {
          value: 3,
          label: "黄金会员"
        },
        {
          value: 4,
          label: "钻石会员"
        }
      ]
    };
  },
  created() {
    this.getData();
    var _this = this;
    document.onkeydown = function(event) {
    			var e = window.event || arguments.callee.caller.arguments[0];
        console.log(e.keyCode)
        if (e.keyCode == 75) {
            _this.addKey();
        }
        if(e.keyCode == 27) {
            _this.closeKey();
        }
    };
  },
  computed: {},
  methods: {
  		addKey(){
			this.isEditForm = false;
			this.addForm = {
        mobile: "",
        name: "",
        email: "",
        avatar: "",
        bonus_points: 0,
        vip_level: 1,
        status: 0,
        user_type: 0,
				sex:'',//  性别 
				birth_day:'',// 出生日期
				education:'',// 学历
				industry:'',// 行业
				position:'',// 职位
				company:'',// 公司
				city:'',// 城市        
      };
      this.addFormVisible = true;
  		},
  		closeKey(){
  			this.addFormVisible = false;
  		},
    qingchu() {
      this.getData();
      this.mobile = "";
    },
    indexMethod(index) {
      return index + 1;
    },

    formatStatus: function(row, column, cellValue) {
      if (cellValue === 0) {
        return "未激活";
      } else {
        return "正常";
      }
    },
    formatPartner: function(row, column, cellValue) {
      if (cellValue === 0) {
        return "总代理";
      } else if (cellValue === 1) {
        return "合伙人";
      } else {
        return "普通用户";
      }
    },
    formatVipLevel: function(row, column, cellValue) {
      switch (cellValue) {
        case 1:
          return "普通会用";
          break;
        case 2:
          return "白银会员";
          break;
        case 3:
          return "黄金会员";
          break;
        case 4:
          return "钻石会员";
          break;
      }
    },

    //时间
    formatTime: function(row, column, cellValue) {
    		if(cellValue){
    			return formatDate(cellValue);
    		}else{
    			return ''
    		}
    },
    formatSex: function(row, column, cellValue) {
    		if(cellValue == '0'){
    			return '女'
    		}else if(cellValue == '1'){
    			return '男'
    		}else if(cellValue == '2'){
    			return '保密'
    		}else{
    			return ''
    		}
    },

    //头像连接上传
    handleAvatarSuccess(file, fileList) {
      console.log(file.name + file.size);
      if (file.name && file.name.match(/\.(jpg|jpeg|png)$/)) {
        var _this = this;
        this.progressVisible = true;
        var complete = function(res) {
          if (res.key && res.key.match(/\.(jpg|jpeg|png)$/)) {
            console.log("77777");
            getPicURL(res.key).then(res => {
              console.log(res.data);

              _this.$message({
                message: "上传成功",
                type: "success"
              });
              _this.progressVisible = false;
              _this.addForm.avatar = res.data;
            });
          }
        };

        var error = function(err) {
          console.log(err);
          _this.progressVisible = false;
          alert("上传出错");
        };

        var next = function(response) {
          var total = response.total;

          _this.progressPercent = parseFloat(total.percent.toFixed(2));

          console.log(_this.progressPercent);
        };

        handleCommonAvatarSuccess(file, fileList, complete, error, next);
      } else {
        this.$message({
          message: "请输入jpg,jpeg,png格式图片",
          type: "error"
        });
      }
    },

    //获取当前数据，并利用del_list进行深复制(防止公用地址,而造成的数据同步修改)
    async getData() {
      await getUsers(this.cur_page, this.size).then(res => {
        console.log(res);
        if (
          !res.data.data ||
          res.data.data == [] ||
          res.data.data.length == 0
        ) {
          if (this.cur_page - 1 > 0) {
            this.cur_page -= 1;
            this.getData();
            //   console.log('page'+this.cur_page);
          } else {
            this.list = [];
            //   console.log('内层'+this.list)
          }
        } else {
          this.list = res.data.data;
          // console.log('外城-'+this.list)
          if (res.data.count) {
            this.total = res.data.count;
          }
        }
      });
      this.del_list = JSON.parse(JSON.stringify(this.list));
    },

    //分页导航
    handleCurrentChange(val) {
      this.cur_page = val;
      this.getData();
    },
		handleSizeChange(val){
	  		this.size = val
	  		this.getData();
	  },
    //搜索
    search() {
      if (this.mobile !== "") {
        getUserInfoByMobile(parseInt(this.mobile)).then(res => {
          if (res.data == null) {
            this.list = null;
          } else {
            this.list = JSON.parse(JSON.stringify(this.del_list));
            this.list.splice(0, this.list.length, res.data);
          }
        });
      } else {
        this.list = JSON.parse(JSON.stringify(this.del_list));
      }
    },

    //删除
    myDelete(index, row) {
      console.log(row + "index:" + index);
      deleteUsersOne(row.id).then(res => {
        if (res.success === true) {
          this.select_cate = "";
          this.getData();
        }
      });
      //再次获取数据，以消除分页后单页数据数量减少
    },

    //批量删除
    batchDelete() {
      let str = "";
      this.multipleSelection.forEach((selection, index) => {
        str += `${selection.id},`;
        console.log(str);
      });
      if (str.endsWith(",")) {
        str = str.slice(0, -1);
      }

      postUsersList(str).then(res => {
        if (res.success === true) {
          this.getData();
        }
      });
    },

    //点击选中被删除项
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    //新增弹框显示
    handleAdd() {
      this.select_cate = "";
      this.isEditForm = false;
      this.addForm = {
        mobile: "",
        name: "",
        email: "",
        avatar: "",
        bonus_points: 0,
        vip_level: 1,
        status: 0,
        user_type: 0,
				sex:'',//  性别 
				birth_day:'',// 出生日期
				education:'',// 学历
				industry:'',// 行业
				position:'',// 职位
				company:'',// 公司
				city:'',// 城市        
      };

      this.addFormVisible = true;
    },

    //新增
    myPostUsersAdd() {
      postUsers(this.addForm).then(res => {
        if (res.success === true) {
          this.addFormVisible = false;
          this.getData();
        } else {
          this.$message({
            message: res.data,
            type: "error"
          });
        }
      });
    },

    //新增弹框 确认按钮 点击
    confirmAdd() {
      this.$refs["addForm"].validate(valid => {
        if (valid) {
          if (this.isEditForm) {
            this.myPutUsersChange();
          } else {
            this.myPostUsersAdd();
          }
        }
      });
    },

    //编辑按钮点击
    handleEdit(index, row) {
      this.isEditForm = true;
      this.addForm = {
        id: row.id,
        status: row.status,
        mobile: row.mobile,
        name: row.name,
        email: row.email,
        avatar: row.avatar,
        bonus_points: row.bonus_points,
        vip_level: row.vip_level,
        user_type: row.user_type,
        sex:row.sex,//  性别 
				birth_day:row.birth_day,// 出生日期
				education:row.education,// 学历
				industry:row.industry,// 行业
				position:row.position,// 职位
				company:row.company,// 公司
				city:row.city // 城市
      };
      this.addFormVisible = true;
    },

    //修改
    myPutUsersChange() {
    		console.log(this.addForm)
      putUsers(this.addForm, this.addForm.id).then(res => {
        if (res.success === true) {
          this.addFormVisible = false;
          this.getData();
        } else {
          this.$message({ message: res.data, type: "error" });
        }
      });
    }
  }
};
</script>

<style scoped>
	.handle-box{
		height: 32px;
	}
	.handle-box .addbtn {
		float: right;
	}
	.touxiang{
		border-radius: 50%;
	}
</style>
