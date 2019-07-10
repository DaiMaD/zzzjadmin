import * as api from './api';
import axios from 'axios';
import Vue from 'vue';
axios.defaults.baseURL = 'https://api.wezhenzhi.com/'; //线上
// axios.defaults.baseURL = 'http://ts.wezhenzhi.com'; //测试
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
// axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8';
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
axios.defaults.timeout = 15000;
// axios.interceptors.response.use((res)=>{
//   return res.data;
// });
export default api;

/*get*/
export function get(url) {
  return axios.get(url).then(function (response) {
    if (response.data.success === true) {
      // console.log("index里的"+response.data)
      return response.data;
    }
  }).catch(function (error) {
    new Vue().$message({
      message: "网络请求错误,请再次尝试",
      type: "error"
    })
  });
};

export const login = params => {
  return axios.post(`admin/login`, params).then(res => res.data).catch(function (error) {
    console.log(error);
  });
};

/*delete*/
export function Delete(url) {
  return axios.delete(url).then(function (response) {
    console.log(response);
    return response.data;
  }).catch(function (error) {
    console.log(error);
  });
};

/*post*/
export function post(url, data) {
  //console.log(data);
  return axios.post(url, data)
    .then(function (response) {
      //    console.log(response.data);
      return response.data;

    })
};

/*put*/
export function put(url, data) {
  //console.log(data);
  return axios.put(url, data).then(function (response) {
    return response.data;
  }).catch(function (error) {
    console.log(error);
  });
};

/*avinfo*/
export function avinfo(url) {
  return axios.avinfo(url).then(function (response) {
    if (response.data.success === true) {
      return response.data;
    }
  }).catch(function (error) {
    new Vue().$message({
      message: "网络请求错误,请再次尝试",
      type: "error"
    })
  });
};
