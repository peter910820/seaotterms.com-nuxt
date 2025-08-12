<script setup lang="ts">
definePageMeta({
  ssr: false,
  middleware: "require-management",
});

import { ref } from "vue";
import { useRouter } from "vue-router";

import { messageStorage } from "@/utils/messageHandler";
import type { BrandRecordCreateRequest } from "@/types/request";
import type { CommonResponse } from "@/types/response";

const router = useRouter();
const form = ref<BrandRecordCreateRequest>({
  brand: "",
  username: "seaotterms",
  completed: 0,
  total: 0,
  dissolution: false,
});

const handleSubmit = async () => {
  try {
    form.value.brand = form.value.brand.trim();
    if (form.value.completed < 0 || form.value.total < 0 || form.value.completed > form.value.total) {
      alert("數值有誤");
      return;
    } else if (form.value.brand === "") {
      alert("ブランド不得為空");
      return;
    }

    const response = await $fetch<CommonResponse>("galgame-brands", {
      baseURL: import.meta.env.VITE_API_URL,
      method: "POST",
      body: form.value,
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
    <h1>Galgameブランド新增</h1>
    <div class="col s12 sub-block wow animate__flipInX">
      <div class="row">
        <div class="input-field col s12">
          <i class="material-icons prefix">apartment</i>
          <input id="brand" v-model="form.brand" type="text" class="validate" required />
          <span class="helper-text" data-error="此欄不能為空" data-success=""></span>
          <label for="brand">ブランド</label>
        </div>
        <div class="input-field col s6">
          <i class="material-icons prefix">done_outline</i>
          <input id="completed" v-model="form.completed" type="number" class="validate" required />
          <span class="helper-text" data-error="此欄不能為空" data-success=""></span>
          <label for="completed">Completed</label>
        </div>
        <div class="input-field col s6">
          <i class="material-icons prefix">format_list_bulleted</i>
          <input id="total" v-model="form.total" type="number" class="validate" required />
          <span class="helper-text" data-error="此欄不能為空" data-success=""></span>
          <label for="total">Total</label>
        </div>
        <div class="input-field col s6">
          <p>
            <label>
              <input type="checkbox" class="filled-in" v-model="form.dissolution" />
              <span>解散</span>
            </label>
          </p>
        </div>
        <div class="col s12">
          <button class="button-submit" type="button" @click="handleSubmit">
            建立
            <i class="material-icons right">send</i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sub-block {
  font-size: 25px !important;
  min-height: 600px;
  height: auto;
}
</style>
