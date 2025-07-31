<script setup lang="ts">
import { ref, onMounted, defineComponent } from "vue";
import { useRouter } from "vue-router";
import { FetchError } from "ofetch";

import { initMaterialDatepicker, initMaterialFormSelect, initMaterialDropdown } from "@/composables/useMaterial";
// pinia store
import type { SystemTodoCreateRequest } from "~/types/request";
import type { CommonResponse, TodoTopicQuery } from "~/types/response";

import { messageStorage } from "@/utils/messageHandler";

const router = useRouter();
const request = ref<SystemTodoCreateRequest>({
  systemName: "",
  title: "",
  detail: "",
  status: 0,
  deadline: "",
  urgency: 0,
  createdName: "seaotterms",
});

const { data, error } = await useFetch<CommonResponse<TodoTopicQuery[]>, CommonResponse>("todo-topics/system", {
  baseURL: import.meta.env.VITE_API_URL,
});

const todoTopics = computed(() => (data.value?.data ?? []) as TodoTopicQuery[]);

if (import.meta.client && error.value) {
  if (error.value.statusCode === 500) {
    messageStorage(error.value.statusCode, error.value.errMsg);
    router.push("/message");
  } else {
    messageStorage();
    router.push("/message");
  }
}

onMounted(async () => {
  // init materializecss
  initMaterialDatepicker();
  initMaterialDropdown();
  initMaterialFormSelect();
});

const handleSubmit = async () => {
  const deadlineTag = document.getElementById("deadline") as HTMLInputElement | null;
  if (deadlineTag) {
    request.value.deadline = deadlineTag.value;
  } else {
    // 找不到ID為deadline的HTML元素
    messageStorage();
    router.push("/message");
    return;
  }
  if ((request.value.deadline ?? "").trim() !== "") {
    const dateStr = request.value.deadline + "T00:00:00Z";
    const timestamp = Date.parse(dateStr);

    if (isNaN(timestamp)) {
      alert("日期格式錯誤");
      return;
    }
    request.value.deadline = dateStr;
  } else {
    request.value.deadline = null;
  }
  if (request.value.title.trim() === "" || request.value.systemName === "") {
    alert("請確保標題以及站台有正確填寫");
    return;
  }

  try {
    const response = await $fetch<CommonResponse>("system-todos", {
      baseURL: import.meta.env.VITE_API_URL,
      method: "POST",
      body: request.value,
    });
    messageStorage(response.statusCode, response.infoMsg);
    router.push("/message");
  } catch (error) {
    if (error instanceof FetchError) {
      const fetchError = error as FetchError<CommonResponse>;
      if (fetchError.status === 401) {
        alert("階段性登入已過期，請重新登入");
        router.push("/login");
      } else {
        messageStorage(fetchError.status, fetchError.data?.errMsg);
        router.push("/message");
      }
    } else {
      messageStorage();
      router.push("/message");
    }
  }
};
</script>

<template>
  <div class="row main-block">
    <h1>建立系統代辦</h1>
    <div class="col s12 sub-block wow animate__flipInX">
      <div class="row">
        <div class="col s4 input-field mobile-hidden">
          <select v-model="request.systemName">
            <option class="validate" value="" disabled selected>選擇站台</option>
            <option v-for="todoTopic in todoTopics" :key="todoTopic.topicName" :value="todoTopic.topicName">
              {{ todoTopic.topicName }}
            </option>
          </select>
          <label>選擇站台</label>
        </div>
        <div class="col s4 input-field mobile-display">
          <select v-model="request.systemName" class="browser-default">
            <option class="validate" value="" disabled selected>選擇站台</option>
            <option v-for="todoTopic in todoTopics" :key="todoTopic.topicName" :value="todoTopic.topicName">
              {{ todoTopic.topicName }}
            </option>
          </select>
        </div>
        <!-- title -->
        <div class="col s8 input-field">
          <input v-model="request.title" id="title" type="text" class="validate" required />
          <span class="helper-text" data-error="此欄不能為空" data-success=""></span>
          <label for="title">標題</label>
        </div>
        <div class="input-field col s12">
          <textarea v-model="request.detail" id="detail" class="materialize-textarea"></textarea>
          <label for="detail">詳細資訊</label>
        </div>
        <!-- urgency -->
        <div class="col s3 input-field mobile-hidden">
          <select v-model="request.urgency">
            <option class="validate" :value="0" selected>普通</option>
            <option class="validate" :value="1" selected>高優先度</option>
            <option class="validate" :value="2" selected>緊急</option>
          </select>
          <label>選擇急迫度</label>
        </div>
        <div class="col s3 input-field mobile-display">
          <select v-model="request.urgency" class="browser-default">
            <option class="validate" :value="0" selected>普通</option>
            <option class="validate" :value="1" selected>高優先度</option>
            <option class="validate" :value="2" selected>緊急</option>
          </select>
        </div>
        <!-- deadline -->
        <div class="col s7 input-field">
          <i class="material-icons prefix">browse_gallery</i>
          <input v-model="request.deadline" id="deadline" type="text" class="datepicker validate" />
          <label for="deadline">截止日期</label>
        </div>
        <div class="col s2 submit">
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
  min-height: 300px;
}
</style>
