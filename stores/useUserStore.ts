import { defineStore } from "pinia";
import { ref } from "vue";

import type { UserType } from "@/types/userTypes";

export const useUserStore = defineStore("user", () => {
  const user = ref<UserType>({
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

  const set = (data: UserType) => {
    if (data?.dataVersion >= user.value.dataVersion) {
      user.value = data;
      console.log("refresh user info");
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
  };

  return {
    user,
    set,
    reset,
  };
});
