<script setup lang="ts">
definePageMeta({
  ssr: false,
  middleware: "require-management",
});

import { ref } from "vue";
import { useRouter } from "vue-router";
import { messageStorage } from "@/utils/messageHandler";

import type { BrandRecordUpdateRequest } from "@/types/request";
import type { BrandRecordQueryResponse, CommonResponse } from "@/types/response";

const router = useRouter();
const route = useRoute();

const brandName = route.params.name as string;

const { data, error } = await useFetch<CommonResponse<BrandRecordQueryResponse[]>, CommonResponse>(
  `galgame-brands/${brandName}`,
  {
    baseURL: import.meta.env.VITE_API_URL,
    credentials: "include",
  },
);

const brandRecord = data.value?.data as BrandRecordQueryResponse[];

const form = ref<BrandRecordUpdateRequest>({
  brand: brandRecord[0].brand,
  completed: brandRecord[0].completed,
  total: brandRecord[0].total,
  dissolution: brandRecord[0].dissolution,
  username: brandRecord[0].updateName,
});

const handleSubmit = async () => {
  form.value.brand = form.value.brand.trim();
  if (form.value.completed < 0 || form.value.total < 0 || form.value.completed > form.value.total) {
    alert("數值有誤");
    return;
  } else if (form.value.brand === "") {
    alert("ブランド不得為空");
    return;
  }
  try {
    const response = await $fetch<CommonResponse>(`galgame-brands/${brandRecord[0].brand}`, {
      baseURL: import.meta.env.VITE_API_URL,
      method: "PATCH",
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
    <h1>Galgameブランド修改</h1>
    <div class="col s12 sub-block wow animate__flipInX">
      <div class="row">
        <div class="col s12 update-div">
          <h2 class="label">上次更新時間: {{ brandRecord[0].updateTime }}</h2>
        </div>
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
          <!-- <label for="username">userName</label> -->
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
            更新
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
  max-height: 600px;
  height: auto;
}
.update-div {
  min-height: 100px;
  max-height: 100px;
}
.label {
  min-height: 100%;
  max-height: 100%;
  font-size: 20px;
  font-weight: bold;
  color: blue;
  white-space: normal;
  word-wrap: break-word;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
