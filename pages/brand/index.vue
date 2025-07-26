<script setup lang="ts">
import { useRouter } from "vue-router";

import { messageStorage } from "~/utils/messageHandler";

import type { CommonResponse, BrandQuery } from "~/types/response";

const router = useRouter();

const { data, error } = await useFetch<CommonResponse<BrandQuery[]>, CommonResponse>("brand", {
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
</script>

<template>
  <div class="row main-block">
    <h1>Galgame品牌一覽</h1>
    <div class="col s12 sub-block">
      <div class="col s3">名稱</div>
      <div class="col s1">遊戲數</div>
      <div class="col s3">狀態</div>
      <div class="col s5">官網URL</div>
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
      <div class="col s5">
        {{ brand.officialUrl }}
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
  background: #f2ebea;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}
h5 {
  color: #287be9;
}
</style>
