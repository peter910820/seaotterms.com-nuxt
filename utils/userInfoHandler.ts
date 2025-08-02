import type { UserType } from "@/types/userTypes";

export const userInfoHandler = (userInfo: UserType | undefined) => {
  const userStore = useUserStore();
  if (userInfo) {
    userStore.set(userInfo);
  }
};
