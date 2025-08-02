import type { UserInfoType } from "@/types/userTypes";

export const userInfoHandler = (userInfo: UserInfoType | undefined) => {
  const userStore = useUserStore();
  if (userInfo) {
    userStore.set(userInfo);
  }
};
