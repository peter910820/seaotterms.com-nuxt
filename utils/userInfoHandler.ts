import type { UserInfoType } from "@/types/userTypes";

export const userInfoHandler = (userInfo: UserInfoType | undefined) => {
  if (userInfo !== undefined) {
    const userStore = useUserStore();
    userStore.set(userInfo);
  }
};
