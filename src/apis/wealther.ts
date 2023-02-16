import service  from "@/utils/service";
namespace simpleWeather {
    // login
    export interface Weather {
        city: string,
        key:string
    }
}
export const cityWeather =  (params:simpleWeather.Weather)=>{
    return service.get<simpleWeather.Weather>("/simpleWeather/query",params)

}