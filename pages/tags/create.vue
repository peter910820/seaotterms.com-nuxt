<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

import { messageStorage } from "@/utils/messageHandler";

import type { TagCreateRequest } from "@/types/request";
import type { CommonResponse } from "@/types/response";

const router = useRouter();
const request = ref<TagCreateRequest>({
  name: "",
  iconName: "",
});

const handleSubmit = async () => {
  if (request.value.name.trim() === "") {
    alert("標題不得為空");
    return;
  }

  try {
    const response = await $fetch<CommonResponse>("tags", {
      baseURL: import.meta.env.VITE_API_URL,
      method: "POST",
      body: request.value,
      credentials: "include",
    });
    userInfoHandler(response.userInfo);
    messageStorage(response.statusCode, response.infoMsg);
    router.push("/message");
  } catch (error) {
    errorHandler(error);
  }
};
</script>

<template>
  <div class="row main-block">
    <h1>建立文章Tag</h1>
    <div class="col s12 sub-block wow animate__flipInX">
      <div class="row">
        <div class="input-field col s12">
          <i class="material-icons prefix">title</i>
          <input id="name" v-model="request.name" type="text" class="validate" required />
          <span class="helper-text" data-error="此欄不能為空" data-success=""></span>
          <label for="name">name</label>
        </div>
        <div class="input-field col s12">
          <i class="material-icons prefix">title</i>
          <input id="iconName" v-model="request.iconName" type="text" class="validate" />
          <span class="helper-text" data-error="" data-success=""></span>
          <label for="iconName">iconName</label>
        </div>
        <div class="col s12">
          <button @click="handleSubmit" class="button-submit" type="button">
            建立文章Tag
            <i class="material-icons right">send</i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lans="scss" scoped>
.sub-block {
  min-height: 300px;
  height: auto;
}
</style>
