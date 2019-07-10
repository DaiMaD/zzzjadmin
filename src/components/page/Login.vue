<template>
    <div class="login-wrap">
        <!--<div class="waves"></div>-->
        <canvas id="canvas"></canvas>
        <div class="ms-title"></div>
        <div class="ms-login">
            <h3 class="ht_title">欢迎登录真知灼见后台管理系统</h3>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="demo-ruleForm">
                <el-form-item prop="username">
                    <el-input v-model="ruleForm.username" placeholder="用户名" v-focus>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input type="password" placeholder="密码" v-model="ruleForm.password"
                        @keyup.enter.native="submitForm('ruleForm')">
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
                </div>

            </el-form>
        </div>
    </div>

</template>
<script>
    import { loginApi } from '../../api/api'
    import { creatwave } from '../../../static/js/wave.js'
    import { creatanimain } from '../../../static/js/creatAnimain.js'
    import bus from '../../components/common/bus.js'

    export default {
        data: function () {
            return {
                ruleForm: {
                    username: '',
                    password: ''
                },
                isShowPop: false,
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' }
                    ]
                }
            }
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.judgeLogin()) {
                            this.requestLogin();
                            //                      console.log(this.ruleForm)
                            localStorage.setItem('ms_username', this.ruleForm.username);
                            // this.$router.push('/home');
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            judgeLogin() {
                //判断用户名和密码是否输入
                if (this.ruleForm.username.length > 4 && this.ruleForm.password.length > 2) {
                    return true
                } else {
                    return false
                }
            },
            requestLogin() {
                var loginParams = { name: this.ruleForm.username, password: this.ruleForm.password };

                loginApi(loginParams).then(data => {
                    console.log(data);
                    if (!data.success) {
                        this.$message({
                            message: data.data,
                            type: 'error'
                        });
                    } else {
                        //                sessionStorage.setItem('user', JSON.stringify(data.data));
                        localStorage.setItem('user', JSON.stringify(data.data));
                        let user = JSON.parse(localStorage.getItem('user'));
                        console.log(user);
                        bus.$emit('headernav', user)
                        this.$router.push('/home2');
                    }
                }).catch(function (response) {
                    this.$message({
                        message: response.data,
                        type: 'error'
                    });
                })
            }
        },
        mounted() {
            //        	creatwave(document.querySelector( '.waves' ))
            creatanimain(document.getElementById('canvas'))
        }

    }
</script>

<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        z-index: 6;
        /*background: url(../../../static/img/login.jpg) no-repeat;
        background-position: center center; */
    }

    .ms-title {
        position: absolute;
        top: 50%;
        width: 100%;
        margin-top: -230px;
        text-align: center;
        font-size: 30px;
        color: #fff;

    }

    .ht_title {
        color: #fff;
        text-align: center;
        margin: 0 0 20px 0;
    }

    .ms-login {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 300px;
        height: 160px;
        margin: -150px 0 0 -190px;
        padding: 20px 40px 40px 40px;
        border-radius: 5px;
        background: rgba(0, 0, 0, .6);
    }

    .login-btn {
        text-align: center;
    }

    .login-btn button {
        width: 100%;
        height: 36px;
    }

    canvas {
        display: block;
    }

    #canvas {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        background: #eee;
    }

    .waves {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
    }
</style>