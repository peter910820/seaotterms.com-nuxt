<script setup lang="ts">
definePageMeta({
  ssr: false,
  middleware: "require-management",
});

import { ref } from "vue";

import { initMaterialDatepicker, initMaterialFormSelect } from "@/composables/useMaterial";

import { messageStorage } from "@/utils/messageHandler";

import type { GameRecordCreateRequest } from "@/types/request";
import type { BrandRecordQueryResponse, CommonResponse } from "@/types/response";

const { data, error } = await useFetch<CommonResponse<BrandRecordQueryResponse[]>, CommonResponse>("galgame-brands", {
  baseURL: import.meta.env.VITE_API_URL,
  credentials: "include",
});

const brandRecord = data.value?.data as BrandRecordQueryResponse[];

const router = useRouter();
const form = ref<GameRecordCreateRequest>({
  username: "seaotterms",
  name: "",
  brand: "",
  releaseDate: "",
  allAges: false,
  endDate: "",
});

onMounted(() => {
  // init select for materializecss
  initMaterialDatepicker();
  initMaterialFormSelect();
});

const handleSubmit = async () => {
  if (form.value.name.trim() == "") {
    alert("遊戲名稱不得為空白");
    return;
  }
  if (form.value.brand.trim() == "") {
    alert("請選擇品牌名稱");
    return;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const releaseDate = new Date((document.getElementById("releaseDate")! as HTMLInputElement).value).toISOString();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const endDate = new Date((document.getElementById("endDate")! as HTMLInputElement).value).toISOString();
  if (endDate <= releaseDate) {
    alert("輸入日期不正確");
    return;
  }
  form.value.releaseDate = releaseDate;
  form.value.endDate = endDate;

  try {
    const response = await $fetch<CommonResponse>("galgames", {
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
    <h1>遊玩完畢Galgame新增</h1>
    <div class="col s12 sub-block floatup-div wow animate__flipInX">
      <div class="row">
        <div class="input-field col s12">
          <i class="material-icons prefix">sports_esports</i>
          <input id="gameName" v-model="form.name" type="text" class="validate" required />
          <span class="helper-text" data-error="此欄不能為空" data-success=""></span>
          <label for="gameName">ゲーム</label>
        </div>
        <div class="input-field col s12">
          <i class="material-icons prefix">apartment</i>
          <select v-model="form.brand">
            <option class="validate" value="" disabled selected>請選擇ブランド</option>
            <option v-for="item in brandRecord" :key="item.brand" :value="item.brand">
              {{ item.brand }}
            </option>
          </select>
          <label>ブランド</label>
        </div>
        <div class="input-field col s6">
          <i class="material-icons prefix">event</i>
          <input id="releaseDate" type="text" class="datepicker validate" required />
          <span class="helper-text" data-error="此欄不能為空" data-success=""></span>
          <label for="releaseDate">発売日</label>
        </div>
        <div class="input-field col s6">
          <i class="material-icons prefix">check_circle</i>
          <input id="endDate" type="text" class="datepicker validate" required />
          <span class="helper-text" data-error="此欄不能為空" data-success=""></span>
          <label for="endDate">遊玩結束時間</label>
        </div>
        <div class="input-field col s6">
          <p>
            <label>
              <input type="checkbox" class="filled-in" v-model="form.allAges" />
              <span>全年齡</span>
            </label>
          </p>
        </div>
        <div class="input-field col s6">
          <select v-model="form.brand" class="browser-default mobile-display">
            <option class="validate" value="" disabled selected>手機板用DDL</option>
            <option class="validate" value="" disabled selected>請選擇ブランド</option>
            <option v-for="item in brandRecord" :key="item.brand" :value="item.brand">
              {{ item.brand }}
            </option>
          </select>
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
