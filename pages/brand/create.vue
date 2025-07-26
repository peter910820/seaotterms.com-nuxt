<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { onMounted } from "vue";

import { initMaterialDatepicker, initMaterialFormSelect } from "~/composables/useMaterial";

import { messageStorage } from "~/utils/messageHandler";

import type { BrandCreateRequest } from "~/types/request";
import type { BrandResponse } from "~/types/response";

const router = useRouter();

const request = ref<BrandCreateRequest>({
  name: "",
  workAmount: 0,
  officialUrl: "",
  dissolution: false,
});

onMounted(() => {
  // init select for materializecss
  initMaterialDatepicker();
  initMaterialFormSelect();
});

const handleSubmit = async () => {
  if (request.value.name.trim() == "") {
    alert("品牌名稱不得為空白");
    return;
  }

  if (request.value.officialUrl.trim() != "") {
    if (
      !(
        request.value.officialUrl.trim().startsWith("http://") ||
        request.value.officialUrl.trim().startsWith("https://")
      )
    ) {
      alert("URL格式錯誤");
      return;
    }
  }

  try {
    const response = await $fetch<BrandResponse>("brand", {
      baseURL: import.meta.env.VITE_API_URL,
      method: "POST",
      body: request.value,
    });

    messageStorage(response.statusCode, response.InfoMsg);
    router.push("/message");
  } catch (error: any) {
    if (error.response?.status === 401) {
      alert("階段性登入已過期，請重新登入");
      router.push("/login");
    } else if (error.response?.status === 500) {
      messageStorage(error.response.status, error.response.data.msg);
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
    <h1>Galgameブランド新增</h1>
    <div class="col s12 sub-block wow animate__flipInX">
      <div class="row">
        <div class="input-field col s6">
          <i class="material-icons prefix">apartment</i>
          <input id="brand" v-model="request.name" type="text" class="validate" required />
          <span class="helper-text" data-error="此欄不能為空" data-success=""></span>
          <label for="brand">ブランド</label>
        </div>
        <div class="input-field col s6">
          <i class="material-icons prefix">format_list_bulleted</i>
          <input id="total" v-model="request.workAmount" type="number" class="validate" required />
          <span class="helper-text" data-error="此欄不能為空" data-success=""></span>
          <label for="total">作品數</label>
        </div>
        <div class="input-field col s12">
          <i class="material-icons prefix">language</i>
          <input id="brand" v-model="request.officialUrl" type="text" class="validate" required />
          <span class="helper-text" data-error="此欄不能為空" data-success=""></span>
          <label for="brand">官方網址</label>
        </div>
        <div class="input-field col s6">
          <p>
            <label>
              <input type="checkbox" class="filled-in" v-model="request.dissolution" />
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
  min-height: 400px;
  height: auto;
}
</style>
