<script setup lang="ts">
definePageMeta({
  ssr: false,
});
import { useUserStore } from "@/stores/useUserStore";
import { FetchError } from "ofetch";

import type { LoginRequest } from "@/types/request";
import type { CommonResponse, LoginResponse } from "~/types/response";

const router = useRouter();
const userStore = useUserStore();

const request = ref<LoginRequest>({
  username: "",
  password: "",
});

const handleSubmit = async () => {
  try {
    const response = await $fetch<CommonResponse<LoginResponse>>("login", {
      baseURL: import.meta.env.VITE_API_URL,
      method: "POST",
      body: request.value,
      credentials: "include",
    });
    messageStorage(response.statusCode, response.infoMsg);
    router.push("/message");
    userStore.set(response.data);
  } catch (error) {
    if (error instanceof FetchError) {
      const fetchError = error as FetchError<CommonResponse>;
      messageStorage(fetchError.status, fetchError.data?.errMsg);
      router.push("/message");
    } else {
      messageStorage();
      router.push("/message");
    }
  }
};
</script>

<template>
  <div class="row main-block">
    <h1>登入</h1>
    <div class="col s12 sub-block floatup-div wow animate__flipInX">
      <div class="row">
        <div class="input-field col s12">
          <i class="material-icons prefix">account_circle</i>
          <input id="icon_prefix" v-model="request.username" type="text" class="validate" required />
          <span class="helper-text" data-error="此欄位不能為空" data-success=""></span>
          <label for="icon_prefix">username</label>
        </div>
        <div class="input-field col s12">
          <i class="material-icons prefix">lock</i>
          <input id="icon_lock" v-model="request.password" type="password" class="validate" required />
          <span class="helper-text" data-error="此欄位不能為空" data-success=""></span>
          <label for="icon_lock">password</label>
        </div>
        <div class="col s12">
          <button @click="handleSubmit" class="button-submit" type="button">
            點我登入
            <i class="material-icons right">send</i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.col {
  margin: 20px;
}
.sub-block {
  min-height: 250px;
  height: auto;
}
</style>
