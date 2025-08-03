<script setup lang="ts">
definePageMeta({
  ssr: false,
});

import { ref } from "vue";
import { useRouter } from "vue-router";
import { messageStorage } from "@/utils/messageHandler";

import type { CommonResponse } from "@/types/response";
import type { UserUpdateRequest } from "@/types/request";

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const form = ref<UserUpdateRequest>({
  id: user.value.id,
  username: user.value.username,
  email: user.value.email,
  exp: user.value.exp,
  management: user.value.management,
  created_at: user.value.created_at,
  updated_at: user.value.updated_at,
  update_name: user.value.update_name,
  avatar: user.value.avatar,
});

const handleSubmit = async () => {
  try {
    const response = await $fetch<CommonResponse>(`users/${form.value.id}`, {
      baseURL: import.meta.env.VITE_API_URL,
      method: "PATCH",
      body: form.value,
      credentials: "include",
    });
    messageStorage(response.statusCode, response.infoMsg);
    userInfoHandler(response.userInfo);
  } catch (error) {
    errorHandler(error);
  }
};
</script>

<template>
  <div class="row main-block">
    <h1>使用者帳號維護</h1>
    <div class="col s12 sub-block floatup-div wow animate__flipInX">
      <div class="row">
        <div class="col s6 title">使用者名稱: {{ form.username }}</div>
        <div class="col s6 title">
          身分:
          <span v-if="form.management">管理員</span>
          <span v-else>一般用戶</span>
          <input type="button" class="button-management" value="變更使用者權限" />
        </div>
        <div class="col s12 input-field">
          <i class="material-icons prefix">sports_esports</i>
          <input
            id="avatar"
            v-model="form.avatar"
            type="text"
            :class="['validate', form.avatar.length > 0 ? 'valid' : 'invalid']"
            required
          />
          <span class="helper-text" data-error="此欄不能為空" data-success=""></span>
          <label for="avatar" :class="[form.avatar.length > 0 ? 'active' : '']">個人圖片URL</label>
        </div>
        <div class="col s12">
          <span>圖片預覽:</span>
          <div class="headShot">
            <img :src="form.avatar" />
          </div>
        </div>
        <div class="col s12">
          <button class="button-submit" type="button" @click="handleSubmit">
            確定修改
            <i class="material-icons right">send</i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sub-block {
  min-height: 550px;
  height: auto;
  > div {
    margin-top: 20px;
  }
  > .title {
    font-size: 30px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
.headShot {
  max-height: 200px;
  max-width: 200px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed orange;
  border-radius: 100%;
  > img {
    width: 100%;
    height: 100%;
  }
}
span {
  font-size: 30px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
/* font-settings */
@font-face {
  font-family: "ChenYuluoyan-Thin";
  src: url("@/assets/fonts/ChenYuluoyan-Thin.ttf") format("truetype");
}
</style>
