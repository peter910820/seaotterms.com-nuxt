import type { UserInfo } from "@/types/user";

export const userInfoHandler = (userInfo: UserInfo | null | undefined) => {
  if (userInfo !== undefined) {
    const userStore = useUserStore();
    userStore.set(userInfo);
  }
};
