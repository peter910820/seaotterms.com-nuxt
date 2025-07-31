<script setup lang="ts">
import { useRouter } from "vue-router";

import { messageStorage } from "~/utils/messageHandler";

import type { CommonResponse, BrandQuery, GameQuery } from "~/types/response";
import { FetchError } from "ofetch";
import dayjs from "dayjs";

const router = useRouter();
const modalVisible = ref<boolean>(false);
const selectedBrand = ref<string>("");
const selectedBrandGames = ref<GameQuery[]>();

const { data, error } = await useFetch<CommonResponse<BrandQuery[]>, CommonResponse>("brands", {
  baseURL: import.meta.env.VITE_API_URL,
});

const brands = computed(() => (data.value?.data ?? []) as BrandQuery[]);

if (import.meta.client && error.value) {
  if (error.value.statusCode === 500) {
    messageStorage(error.value.statusCode, error.value.errMsg);
    router.push("/message");
  } else {
    messageStorage();
    router.push("/message");
  }
}

const openModal = async (brand: string) => {
  selectedBrand.value = brand;
  try {
    const response = await $fetch<CommonResponse<GameQuery[]>>(`galgames/${brand}`, {
      baseURL: import.meta.env.VITE_API_URL,
      method: "GET",
    });
    selectedBrandGames.value = response.data;
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
  modalVisible.value = true;
};

const closeModal = () => {
  modalVisible.value = false;
};

const formatDate = (date: string) => dayjs(date).format("YYYY-MM-DD");
</script>

<template>
  <div class="row main-block">
    <h1>Galgame品牌一覽</h1>
    <div class="col s12 sub-block">
      <div class="col s3">名稱</div>
      <div class="col s1">遊戲數</div>
      <div class="col s3">狀態</div>
      <div class="col s4">官網URL</div>
      <div class="col s1">遊戲</div>
    </div>
    <div class="col s12 sub-block floatup-div wow animate__slideInUp" v-for="brand in brands" :key="brand.id">
      <div class="col s3">
        {{ brand.name }}
      </div>
      <div class="col s1">
        {{ brand.workAmount }}
      </div>
      <div v-if="brand.dissolution" class="col s3" style="color: red">解散</div>
      <div v-else="brand.dissolution" class="col s3">正常</div>
      <div class="col s4">
        {{ brand.officialUrl }}
      </div>
      <div class="col s1" @click="openModal(brand.name)">+</div>
    </div>

    <!-- 全螢幕彈出視窗 -->
    <div v-if="modalVisible" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h4>{{ selectedBrand }} 通關遊戲資料</h4>
        <div class="col s12 galgameBrandHeader">
          <div class="col s5 left-align">ゲーム</div>
          <div class="col s2">発売日</div>
          <div class="col s3">OP URL</div>
          <div class="col s1">全年齡</div>
          <div class="col s1">修改</div>
        </div>
        <div class="col s12 galgameBrand floatup-div" v-for="brandGames in selectedBrandGames" :key="brandGames.name">
          <div class="col s6 left-align">{{ brandGames.name }}</div>
          <div class="col s2">{{ formatDate(brandGames.releaseDate) }}</div>
          <div class="col s3">{{ formatDate(brandGames.OpUrl) }}</div>
          <div class="col s1" v-if="brandGames.allAges === false">
            <b>
              <font color="pink">18+</font>
            </b>
          </div>
          <div class="col s1" v-else><font color="purple">全年齡</font></div>
          <div class="col s1">
            <router-link :to="`/`" class="button-simple modify">修改</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sub-block {
  font-size: 25px !important;
  max-height: 100px;
  height: 150px;
}
@media (max-width: 768px) {
  .sub-block {
    font-size: 20px !important;
    max-height: 100px;
    height: 150px;
  }
}
.todo-title {
  text-align: left;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  overflow: hidden !important;
}
.todo-date {
  text-align: center;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  overflow: hidden !important;
  color: olive;
}
.todo-status {
  text-align: right;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  overflow: hidden !important;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  height: 75vh;
  width: 75vw;
  overflow-y: auto;
  overflow-x: hidden;
  background: var(--color-background);
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}
h5 {
  color: #287be9;
}
</style>
