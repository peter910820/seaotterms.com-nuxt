<script setup lang="ts">
import { ref, defineComponent } from "vue";
import { useRouter } from "vue-router";

import { messageStorage } from "@/utils/messageHandler";

import type { GameRecordUpdateRequest } from "@/types/request";
import type { BrandRecordQueryResponse, CommonResponse, GameRecordQueryResponse } from "@/types/response";

console.log("這是開發用的頁面，請確定你真的知道自己在幹嘛再執行動作");

const route = useRoute();
const router = useRouter();

const gameName = route.params.name as string;

const { data, error } = await useFetch<CommonResponse<GameRecordQueryResponse[]>, CommonResponse>(
  `galgame/s/${gameName}`,
  {
    baseURL: import.meta.env.VITE_API_URL,
    credentials: "include",
  },
);

const gameRecord = data.value?.data as GameRecordQueryResponse[];

const form = ref<GameRecordUpdateRequest>({
  name: gameRecord[0].name,
  brand: gameRecord[0].brand,
  releaseDate: gameRecord[0].releaseDate,
  allAges: gameRecord[0].allAges,
  endDate: gameRecord[0].endDate,
  updateTime: gameRecord[0].updateTime,
  username: gameRecord[0].updateName?.trim() === "" ? gameRecord[0].inputName : gameRecord[0].updateName,
});

const handleSubmit = async () => {
  try {
    const response = await $fetch<CommonResponse>(`galgames/develop/${gameRecord[0].name}`, {
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
    <h1>遊玩完畢Galgame修改(Develop)</h1>
    <div class="col s12 wow animate__flipInX">
      <div class="row">
        <div class="col s6 sub-block update-div">
          <h2 class="label">上次更新使用者: {{ form.username }}</h2>
        </div>
        <div class="col s6 update-div">
          <h2 class="label">上次更新時間: {{ form.updateTime }}</h2>
        </div>
        <div class="input-field col s12">
          <i class="material-icons prefix">sports_esports</i>
          <input id="gameName" v-model="form.name" type="text" class="validate" required />
          <span class="helper-text" data-error="此欄不能為空" data-success=""></span>
          <label for="gameName">ゲーム</label>
        </div>
        <div class="input-field col s6">
          <i class="material-icons prefix">event</i>
          <input id="releaseDate" v-model="form.releaseDate" type="text" class="datepicker validate" required />
          <span class="helper-text" data-error="此欄不能為空" data-success=""></span>
          <label for="releaseDate">発売日</label>
        </div>
        <div class="input-field col s6">
          <i class="material-icons prefix">check_circle</i>
          <input id="endDate" v-model="form.endDate" type="text" class="datepicker validate" required />
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
        <div class="col s12">
          <button class="button-submit" type="button" @click="handleSubmit">
            修改(Develop)
            <i class="material-icons right">send</i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sub-block {
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
