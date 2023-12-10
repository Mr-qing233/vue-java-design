//封装axios
import axios from "axios";

// 处理 类型"AxiosResponse<any, any>"上不存在属性"xxx"
declare module "axios" {
  interface AxiosResponse {
    code: Number;
    msg: String;
  }
  export function create(config?: AxiosRequestConfig): AxiosInstance;
}

const request = axios.create({
  baseURL: "/api", //这里是全局统一添加/api前缀,页面里面写接口的时候就不要加/api,否则会出现/api/api/user
  timeout: 5000,
});

//request请求拦截
//可进行统一添加token
request.interceptors.request.use(
  (config) => {
    config.headers["Content-Type"] = "application/json;charset=utf-8";

    // config.headers['token'] = user.token;  // 设置请求头
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
  (response) => {
    let res = response.data;
    // 如果是返回的文件
    if (response.config.responseType === "blob") {
      return res;
    }
    // 兼容服务端返回的字符串数据
    if (typeof res === "string") {
      res = res ? JSON.parse(res) : res;
    }
    return res;
  },
  (error) => {
    console.log("err" + error); // for debug
    return Promise.reject(error);
  }
);

export default request;
