import type { MockMethod } from "vite-plugin-mock";
export default [
  {
    url: "/login", // 注意，这里只能是string格式
    method: "post",
    response: () => {
      return {
        menusList: [1,2,3,4,],
      };
    },
  },
] as MockMethod[]