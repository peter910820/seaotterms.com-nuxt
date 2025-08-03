import type { CommonResponse } from "@/types/response";
import { FetchError } from "ofetch";

export default defineNuxtRouteMiddleware(async (to) => {
  // SSR階段不讓他進行任何userinfo的獲取，將這部分完全交給CSR
  // 如果有頁面是非公開頁面(是需要登入的)，那就讓該頁面資料的useeFetch增加lazy: true，讓資料獲取在CSR階段才執行
  // 這樣可以避免SSR階段拿不到資料，CSR也不會重新發送請求的狀況
  if (import.meta.server) return;

  if (to.path === "/message") return;

  try {
    const response = await $fetch<CommonResponse>("auth", {
      baseURL: import.meta.env.VITE_API_URL,
      method: "GET",
      credentials: "include",
    });
    userInfoHandler(response.userInfo);

    if (to.path === "/todolists") {
      if (response.userInfo === null) {
        alert("使用者未登入");
        return navigateTo("/login");
      }
    }
  } catch (error) {
    if (error instanceof FetchError) {
      const fetchError = error as FetchError<CommonResponse>;
      userInfoHandler(fetchError.data?.userInfo);
      messageStorage(fetchError.status, fetchError.data?.errMsg);
      return navigateTo("/message");
    } else {
      messageStorage();
      return navigateTo("/message");
    }
  }
});
