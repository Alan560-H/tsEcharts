import type { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse, Axios } from 'axios'
import axios from 'axios'
import { ElMessageBox, ElMessage } from 'element-plus'


enum ServerEnums {
    TIMEOUT = 5000,
    FAIL = 500,
    SUCCESS = 200,
    LOGINTIMEOUT = 400
}
// 定义Result接口，不含data
interface Result {
    code: number,
    success: boolean,
    msg: string
}

/**
 *@description 定义返回数据格式，继承Result接口 
 */
interface ResultData<T = any> extends Result {
    data?: T //data可选，因为有的时候data可能为null
}
const config = {
    // baseURL: import.meta.env.VITE_APP_BASE_API as string,
    baseURL:"",
    timeout: ServerEnums.TIMEOUT,
    withCredentials: true,// 跨越的时候允许携带凭证
}

class Service {
    service: AxiosInstance;
    constructor(config: AxiosRequestConfig) {
        this.service = axios.create(config)
        this.service = this.setInterceptors(this.service);
    }

    private setInterceptors(service: AxiosInstance): AxiosInstance {
        // 请求拦截器，如果有token的话
        service.interceptors.request.use((config) => {
            const token = localStorage.getItem("token");
            if (config.headers && token) config.headers["customToken"] = token;
            return config
        })

        // 响应拦截器
        service.interceptors.response.use(
            (response: AxiosResponse) => {
                const { data } = response;
                // 超时的情况
                if (data.code === ServerEnums.TIMEOUT) {
                    ElMessageBox.alert("Session expired", "System info", {
                        confirmButtonText: "Relogin",
                        type: "warning"
                    }).then(() => {
                        // 这里也可以调用loginOut()方法
                        localStorage.setItem('token', "");
                        location.href = "/";
                    })
                }
                // 如果产生错误,返回错误数据
                if (data.code && data.code !== ServerEnums.SUCCESS) {
                    ElMessage.error(data);
                    return Promise.reject(data);
                }
                return response;
            },
            (error:AxiosError)=>{
                const {response} = error;
                if(response){
                    this.handleCode(response.status);
                }
                if(!window.navigator.onLine){
                    // 这里也可以重定向至404页面
                    ElMessage.error("网络连接失败，请检查网络");
                }
            }
        )
        return service;
    }
    // 状态码 回调
    public handleCode = (code:number):void=>{
        switch(code){
            case 401:
                ElMessage.error("登陆失败，请重新登录");
                break;
            case 500:
                ElMessage.error("请求异常，请联系管理员");
                break;
            default:
                ElMessage.error('请求失败');
                break;
        }
    }
    get<T>(url:string,params?:object):Promise<ResultData<T>>{
        this.service.defaults.baseURL = "";
        return this.service.get(url,{params})
    }

    post<T>(url:string,params?:object):Promise<ResultData<T>>{
        return this.service.post(url,{params})
    }

    put<T>(url:string,params?:object):Promise<ResultData<T>>{
        return this.service.put(url,{params})
    }
    
    delete<T>(url:string,params?:object):Promise<ResultData<T>>{
        return this.service.delete(url,{params})
    }
}

export default new Service(config);