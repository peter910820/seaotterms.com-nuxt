import { defineStore } from "pinia";
import { ref } from "vue";

import type { UserInfoType } from "@/types/userTypes";

export const useUserStore = defineStore("user", () => {
  const user = ref<UserInfoType>({
    id: 0,
    username: "",
    email: "",
    exp: 0,
    management: false,
    created_at: new Date(),
    updated_at: new Date(),
    update_name: "",
    avatar: "",
    dataVersion: 0,
  });

  const set = (data: UserInfoType | null) => {
    if (data) {
      if (data.dataVersion >= user.value.dataVersion) {
        Object.assign(user.value, data); // 保留 reactive object，更新內容
      }
    } else {
      // 當後端傳回空並且剛才是有登入的(代表Session到期被登出或是客戶端手動清除Cookies)
      if (user.value.id !== 0) {
        console.log("reset");
        reset();
      }
    }
  };

  const reset = () => {
    user.value.id = 0;
    user.value.username = "";
    user.value.email = "";
    user.value.exp = 0;
    user.value.management = false;
    user.value.created_at = new Date();
    user.value.updated_at = new Date();
    user.value.update_name = "";
    user.value.avatar = "";
    user.value.dataVersion = 0;
  };

  return {
    user,
    set,
    reset,
  };
});
