<script setup lang="ts">
definePageMeta({
  ssr: false,
  middleware: "require-management",
});

import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

import { messageStorage } from "@/utils/messageHandler";
import { initMaterialFormSelect } from "@/composables/useMaterial";

import type { ArticleCreateRequest } from "@/types/request";
import type { CommonResponse, TagQueryResponse } from "@/types/response";

import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css"; // highlight-styles

const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const form = ref<ArticleCreateRequest>({
  title: "",
  username: user.value?.username,
  tags: [],
  content: "",
});
const choiceTag = ref<TagQueryResponse[]>();

const router = useRouter();

const { data, error } = await useFetch<CommonResponse<TagQueryResponse[]>, CommonResponse>("tags", {
  baseURL: import.meta.env.VITE_API_URL,
  credentials: "include",
});

if (import.meta.client && error.value) {
  if (error.value.statusCode === 500) {
    messageStorage(error.value.statusCode, error.value.errMsg);
    router.push("/message");
  } else {
    messageStorage();
    router.push("/message");
  }
}

choiceTag.value = data.value?.data;

onMounted(async () => {
  // init materializecss
  initMaterialFormSelect();
});

const handleSubmit = async () => {
  if (form.value.title.trim() === "") {
    alert("標題不得為空");
    return;
  }

  try {
    const response = await $fetch<CommonResponse>("articles", {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderMarkdown = (content: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const md: any = MarkdownIt({
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return (
            '<pre><code class="hljs">' +
            hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
            "</code></pre>"
          );
        } catch (error) {
          console.log(error);
        }
      }

      return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + "</code></pre>";
    },
  });
  return md.render(content);
};
const renderedMarkdown = computed(() => renderMarkdown(form.value.content));
</script>

<template>
  <div class="row main-block">
    <h1>建立</h1>
    <div class="col s12 sub-block wow animate__flipInX">
      <div class="row">
        <div class="input-field col s12">
          <i class="material-icons prefix">title</i>
          <input id="title" v-model="form.title" type="text" class="validate" required />
          <span class="helper-text" data-error="此欄不能為空" data-success=""></span>
          <label for="title">title</label>
        </div>
        <div class="input-field col s6">
          <i class="material-icons prefix">account_circle</i>
          <input id="username" v-model="form.username" type="text" disabled />
          <!-- <label for="username">userName</label> -->
        </div>
        <div class="input-field col s6">
          <select v-model="form.tags" multiple>
            <option value="" disabled selected>選擇Tag</option>
            <option v-for="tag in choiceTag" :key="tag.name" :value="tag.name">
              {{ tag.name }}
            </option>
          </select>
          <label>Materialize Multiple Select</label>
        </div>
        <div class="input-field text-insert col s6">
          <i class="material-icons prefix">mode_edit</i>
          <textarea id="textarea1" v-model="form.content" class="materialize-textarea"></textarea>
          <label for="textarea1">Content</label>
        </div>
        <div class="markdown-preview col s6" v-html="renderedMarkdown"></div>
        <div class="col s12">
          <p class="hint">本功能使用markdown支援(右邊會有markdown即時預覽)</p>
        </div>
        <div class="col s12">
          <button class="button-submit" type="button" @click="handleSubmit">
            建立文章
            <i class="material-icons right">send</i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.row {
  padding: 50px;
}
.hint {
  color: red;
}
.sub-block {
  min-height: 300px;
  height: auto;
}
.text-insert {
  max-height: 200px;
  overflow: auto;
}
.markdown-preview {
  max-height: 200px;
  overflow: auto;
}
</style>
