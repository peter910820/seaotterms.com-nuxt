<script setup lang="ts">
definePageMeta({
  ssr: false,
});

import { ref } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import { messageStorage } from "@/utils/messageHandler";

import type { TodoTopicRequest } from "@/types/request";
import type { CommonResponse } from "@/types/response";
import { errorHandler } from "@/utils/errorHandler";

const router = useRouter();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const form = ref<TodoTopicRequest>({
  topicName: "",
  topicOwner: user.value.username,
  updatedAt: new Date(),
  updateName: user.value.username,
});

const handleSubmit = async () => {
  if (form.value.topicName.trim() === "") {
    alert("標題不得為空");
    return;
  }

  try {
    const response = await $fetch<CommonResponse>("todo-topics", {
      baseURL: import.meta.env.VITE_API_URL,
      method: "POST",
      body: form.value,
      credentials: "include",
    });
    userInfoHandler(response.userInfo);
    messageStorage(response.statusCode, "資料創建成功");
    router.push("/message");
  } catch (error) {
    errorHandler(error);
  }
};
</script>

<template>
  <div class="row main-block">
    <h1>建立Todo主題</h1>
    <div class="col s12 sub-block wow animate__flipInX">
      <div class="row">
        <div class="input-field col s12">
          <i class="material-icons prefix">title</i>
          <input id="title" v-model="form.topicName" type="text" class="validate" required />
          <span class="helper-text" data-error="此欄不能為空" data-success=""></span>
          <label for="title">title</label>
        </div>
        <div class="col s12">
          <button @click="handleSubmit" class="button-submit" type="button">
            建立主題
            <i class="material-icons right">send</i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sub-block {
  min-height: 200px;
  height: auto;
}
</style>
