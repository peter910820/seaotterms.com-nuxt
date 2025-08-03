import type { UserInfoType } from "@/types/userTypes";

export const userInfoHandler = (userInfo: UserInfoType | null | undefined) => {
  if (userInfo !== undefined) {
    const userStore = useUserStore();
    userStore.set(userInfo);
  }
};
