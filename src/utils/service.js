//在index.js中引入axios
import axios from "axios";
//引入qs模块，用来序列化post类型的数据
//antd的message提示组件，大家可根据自己的ui组件更改。
import { message } from "antd";
import { logout } from "./toolfunc";
// message.config({
//   maxCount: 1,
//   rtl: true,
// })
console.log("API_BASE>>>>", process.env.API_BASE);
//区分开发环境还是生产环境baseUrl
export const baseUrl = process.env.API_BASE;

//设置axios基础路径
const service = axios.create({
  baseURL: baseUrl,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 每次发送请求之前本地存储中是否存在token，也可以通过Redux这里只演示通过本地拿到token
    // 如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
    // 即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断

    // 如果存在userInfo 说明登录成功 取token设置请求头信息 请求接口
    // 没有userInfo说明未登录
    let useInfo = localStorage.getItem("userInfo");
    if (useInfo !== "" && useInfo !== undefined && useInfo !== null) {
      const user = JSON.parse(useInfo);
      const token = user && user.userToken ? user.userToken : "";
      if (token) {
        config.headers = {
          token,
          "X-Button-Type": "",
          "X-System-Type": "cus_system",
          "X-Tenant-Id": user.tenantId, //租户
          "X-User-Id": user.id, //登录用户
        };
      }
    }
    config.headers["User-Inner-Ip"] = "";
    config.headers["User-Outer-Ip"] = window.returnCitySN["cip"];
    //设置请求头
    return config;
  },
  (error) => {
    return error;
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    //根据返回不同的状态码做不同的事情
    // 这里一定要和后台开发人员协商好统一的错误状态码
    if ((response.data && response.data.code) || response.code) {
      let code = response.data.code || response.code;
      switch (code) {
        case 200:
          return response.data;
        case 0:
          return response.data;
        case 400:
          // 失败
          message.error(response.data.message);
          throw new Error(response.data.message);
        case 401:
          // token
          message.destroy()
          message.error(response.data.message, 1).then(() => {
            logout();
          });
          throw new Error(response.data.message);
        case 403:
          // 禁止访问
          message.error(response.data.message);
          throw new Error(response.data.message);
        default:
          message.error(response.data.message);
          throw new Error(response.data.message);
      }
    } else {
      return response.data;
    }
  },
  (err) => {
    message.error("网络错误或服务器繁忙，请稍后再试..");
    throw new Error(err);
  }
);
//最后把封装好的axios导出
export default service;
