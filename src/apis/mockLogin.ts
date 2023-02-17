import service  from "@/utils/service";

export const login = ()=>{
    return service.post("/login")
}