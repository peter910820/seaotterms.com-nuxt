<script setup lang="ts">
import { ref } from "vue";
import dayjs from "dayjs";

import type { BrandRecordQueryResponse, CommonResponse, GameRecordQueryResponse } from "@/types/response";

const modalVisible = ref(false);
const selectedBrand = ref("");
const selectedBrandGames = ref<GameRecordQueryResponse[]>([]);
let total = ref(0);

const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const userData = computed(() => user.value);

const router = useRouter();

const { data, error } = await useFetch<CommonResponse<BrandRecordQueryResponse[]>, CommonResponse>("galgame-brands", {
  baseURL: import.meta.env.VITE_API_URL,
  credentials: "include",
});

const brandRecord = data.value?.data as BrandRecordQueryResponse[];
total.value = brandRecord.reduce((acc, cur) => acc + cur.completed, 0);

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
    const response = await $fetch<CommonResponse<GameRecordQueryResponse[]>>(`galgames/${brand}`, {
      baseURL: import.meta.env.VITE_API_URL,
      method: "GET",
      credentials: "include",
    });
    selectedBrandGames.value = response.data;
    userInfoHandler(response.userInfo);
  } catch (error) {
    errorHandler(error);
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
    <div class="col s12 center-align galgameBrandTitle">
      <div class="col s12">
        Galgameブランド紀錄
        <router-link
          v-if="userData.username !== undefined && userData.management"
          to="/self-galgames/brands/create"
          class="button-simple"
          >點我新增品牌</router-link
        >

        <router-link
          v-if="userData.username !== undefined && userData.management"
          to="/self-galgames/games/create"
          class="button-simple"
          >點我新增遊戲</router-link
        >
      </div>
    </div>
    <div class="col s12 galgameBrandHeader">
      <div class="col s3">ブランド</div>
      <div class="col s2">攻略數</div>
      <div class="col s2">總遊戲數</div>
      <div class="col s2">狀態</div>
      <div class="col s1">解散</div>
      <div class="col s1">修改</div>
      <div class="col s1">展開</div>
    </div>
    <div class="col s12 galgameBrandHeader">
      <div class="col s3"></div>
      <div class="col s2">{{ total }}</div>
      <div class="col s2"></div>
      <div class="col s2"></div>
      <div class="col s1"></div>
      <div class="col s1"></div>
      <div class="col s1"></div>
    </div>
    <div
      class="col s12 galgameBrand floatup-div wow animate__slideInUp"
      v-for="galgameBrandData in brandRecord"
      :key="galgameBrandData.brand"
    >
      <div class="col s3 brand">{{ galgameBrandData.brand }}</div>
      <div class="col s2">{{ galgameBrandData.completed }}</div>
      <div class="col s2">{{ galgameBrandData.total }}</div>
      <div class="col s2" v-if="galgameBrandData.annotation === '制霸'">
        <b>
          <font color="blue">{{ galgameBrandData.annotation }}</font>
        </b>
      </div>
      <div class="col s2" v-else>{{ galgameBrandData.annotation }}</div>
      <div class="col s1">
        <font color="red">{{ galgameBrandData.dissolution ? "解散" : "" }}</font>
      </div>
      <div class="col s1">
        <router-link :to="`/self-galgames/brands/${galgameBrandData.brand}/edit`" class="button-simple modify">
          修改
        </router-link>
      </div>
      <div class="col s1">
        <button class="button-simple modify" @click="openModal(galgameBrandData.brand)">+</button>
      </div>
    </div>

    <!-- 全螢幕彈出視窗 -->
    <transition name="fade">
      <div v-if="modalVisible" class="modal-overlay" @click="closeModal">
        <div class="modal-content" @click.stop>
          <h4>{{ selectedBrand }} 通關遊戲資料</h4>
          <div class="col s12 galgameBrandHeader">
            <div class="col s6 left-align">ゲーム</div>
            <div class="col s2">発売日</div>
            <div class="col s2">遊玩結束時間</div>
            <div class="col s1">全年齡</div>
            <div class="col s1">修改</div>
          </div>
          <div class="col s12 galgameBrand floatup-div" v-for="brandGames in selectedBrandGames" :key="brandGames.name">
            <div class="col s6 left-align">{{ brandGames.name }}</div>
            <div class="col s2">{{ formatDate(brandGames.releaseDate) }}</div>
            <div class="col s2">{{ formatDate(brandGames.endDate) }}</div>
            <div class="col s1" v-if="brandGames.allAges === false">
              <b>
                <font color="pink">18+</font>
              </b>
            </div>
            <div class="col s1" v-else><font color="purple">全年齡</font></div>
            <div class="col s1">
              <router-link :to="`/self-galgames/games/${brandGames.name}/edit`" class="button-simple modify"
                >修改</router-link
              >
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.col {
  max-height: 50px;
  height: 50px;
  margin-top: 10px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: default;
}
.galgameBrandTitle {
  text-align: center;
  font-size: 50px;
  font-weight: bold;
  max-height: 100px;
  height: 100px;
  > .col {
    padding: 0px;
    margin: 0px;
    min-height: 100%;
  }
}
.galgameBrandHeader {
  text-align: center;
  font-size: x-large;
  font-weight: bold;
  max-height: 80px;
  height: 80px;
}
.galgameBrand {
  text-align: center;
  max-height: 100%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  > div {
    font-size: x-large;
    margin-left: 5px;
    padding: 0px;
    max-height: 100%;
    > button {
      padding: 0px !important;
      height: 30px;
      max-height: 30px;
      font-size: 20px;
    }
  }
}
.brand {
  font-weight: bold;
}
.modify {
  height: 30px;
  width: 40px;
}
.details {
  max-height: 200px;
  height: 200px;
}
td {
  font-size: large;
}
a {
  color: black !important;
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
  padding: 40px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
