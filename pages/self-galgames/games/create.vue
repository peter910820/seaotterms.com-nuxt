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
  opDisplayScore: null,
  opSongScore: null,
  opCompatibilityScore: null,
  edSongScore: null,
  musicScore: null,
  plotScore: 0,
  artScore: 0,
  systemScore: 0,
  themeScore: 0,
  conclusionScore: 0,
  category: "",
  recommended: 0,
  experience: "",
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
    alert("遊玩結束日期不可小於發售日期");
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
        <div class="input-field col s4">
          <i class="material-icons prefix">event</i>
          <input id="releaseDate" type="text" class="datepicker validate" required />
          <span class="helper-text" data-error="此欄不能為空" data-success=""></span>
          <label for="releaseDate">発売日</label>
        </div>
        <div class="input-field col s4">
          <i class="material-icons prefix">check_circle</i>
          <input id="endDate" type="text" class="datepicker validate" required />
          <span class="helper-text" data-error="此欄不能為空" data-success=""></span>
          <label for="endDate">遊玩結束時間</label>
        </div>
        <div class="input-field col s4">
          <label>
            <input type="checkbox" class="filled-in" v-model="form.allAges" />
            <span>全年齡</span>
          </label>
        </div>
        <!-- 分數填入 -->
        <div class="col s12 center">分數填入</div>
        <div class="input-field col s3">
          <i class="material-icons prefix">sports_esports</i>
          <input v-model="form.opSongScore" id="gameName" type="number" class="validate" />
          <label for="gameName">OP歌曲</label>
        </div>
        <div class="input-field col s3">
          <i class="material-icons prefix">sports_esports</i>
          <input v-model="form.opDisplayScore" id="gameName" type="number" class="validate" />
          <label for="gameName">OP畫面</label>
        </div>
        <div class="input-field col s3">
          <i class="material-icons prefix">sports_esports</i>
          <input v-model="form.opCompatibilityScore" id="gameName" type="number" class="validate" />
          <label for="gameName">OP畫面與歌曲契合度</label>
        </div>
        <div class="input-field col s3">
          <i class="material-icons prefix">sports_esports</i>
          <input v-model="form.edSongScore" id="gameName" type="number" class="validate" />
          <label for="gameName">ED</label>
        </div>
        <div class="input-field col s3">
          <i class="material-icons prefix">sports_esports</i>
          <input v-model="form.musicScore" id="gameName" type="number" class="validate" />
          <label for="gameName">音樂(以前玩過的會沒有資料)</label>
        </div>
        <div class="input-field col s3">
          <i class="material-icons prefix">sports_esports</i>
          <input v-model="form.plotScore" id="gameName" type="number" class="validate" required />
          <span class="helper-text" data-error="此欄不能為空" data-success=""></span>
          <label for="gameName">劇情</label>
        </div>
        <div class="input-field col s3">
          <i class="material-icons prefix">sports_esports</i>
          <input v-model="form.artScore" id="gameName" type="number" class="validate" required />
          <span class="helper-text" data-error="此欄不能為空" data-success=""></span>
          <label for="gameName">美術</label>
        </div>
        <div class="input-field col s3">
          <i class="material-icons prefix">sports_esports</i>
          <input v-model="form.systemScore" id="gameName" type="number" class="validate" required />
          <span class="helper-text" data-error="此欄不能為空" data-success=""></span>
          <label for="gameName">系統</label>
        </div>
        <div class="input-field col s3">
          <i class="material-icons prefix">sports_esports</i>
          <input v-model="form.themeScore" id="gameName" type="number" class="validate" required />
          <span class="helper-text" data-error="此欄不能為空" data-success=""></span>
          <label for="gameName">題材</label>
        </div>
        <div class="input-field col s3">
          <i class="material-icons prefix">sports_esports</i>
          <input v-model="form.conclusionScore" id="gameName" type="number" class="validate" required />
          <span class="helper-text" data-error="此欄不能為空" data-success=""></span>
          <label for="gameName">收尾</label>
        </div>
        <div class="input-field col s3">
          <select v-model="form.category">
            <option class="validate" value="" disabled selected>選擇遊戲類型</option>
            <option class="validate" value="一般系">一般系</option>
            <option class="validate" value="泣系">泣系</option>
            <option class="validate" value="制鬱系">制鬱系</option>
            <option class="validate" value="拔作系">拔作系</option>
            <option class="validate" value="哲學系">哲學系</option>
          </select>
        </div>
        <div class="input-field col s3">
          <select v-model="form.recommended">
            <option class="validate" value="" disabled selected>選擇個人推薦程度</option>
            <option class="validate" value="大推">大推</option>
            <option class="validate" value="推">推</option>
            <option class="validate" value="普">普</option>
            <option class="validate" value="不推">不推</option>
          </select>
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
