import { FetchError } from "ofetch";
import type { CommonResponse } from "@/types/response";

export const errorHandler = (error: any) => {
  const router = useRouter();
  if (error instanceof FetchError) {
    const fetchError = error as FetchError<CommonResponse>;
    // 錯誤的時候，也要更新UserInfo
    userInfoHandler(fetchError.data?.userInfo);
    messageStorage(fetchError.status, fetchError.data?.errMsg);
    if (fetchError.status === 401) {
      alert("階段性登入已過期，請重新登入");
      router.push("/login");
    } else {
      messageStorage(fetchError.status, fetchError.data?.errMsg);
      router.push("/message");
    }
  } else {
    messageStorage();
    router.push("/message");
  }
};
