<script lang="ts" setup>
const apiUrl = useRuntimeConfig().public.API_URL;

const { data, error } = await useFetch<Response>(apiUrl + "/series", {
  method: "GET",
  lazy: false,
  server: true,
});
// import { defineComponent, onMounted, ref } from "vue";
// import { useRouter } from "vue-router";
// import { useArticleStore } from "@/store/article";
// import { storeToRefs } from "pinia";
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// declare const Typed: any;

// export default defineComponent({
//   setup() {
//     const router = useRouter();
//     const articleStore = useArticleStore();
//     const { article } = storeToRefs(articleStore);
//     const articleContent = ref(article.value);

//     const link = (mod: string, target: string) => {
//       if (mod === "article") {
//         router.push(`/articles/${target}`);
//       } else {
//         router.push(`./tags/${target}`);
//       }
//     };
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const tagClick = (tag: string, event: any) => {
//       event.stopPropagation();
//       link("tag", tag);
//     };

//     onMounted(() => {
//       // eslint-disable-next-line no-undef
//       new Typed(".banner>div>div", {
//         strings: ["正在嘗試進步，", "學很多怪技術跟做很多小東西。"],
//         typeSpeed: 80,
//         loop: true,
//         showCursor: false,
//       });
//     });

//     return {
//       link,
//       tagClick,
//       articleContent,
//     };
//   },
// });
</script>

<template>
  <div class="row main-block">
    <div class="col s12 sub-block banner wow animate__flipInX">
      <div><div></div></div>
    </div>
    <h1>首頁/文章</h1>
    <!-- <div
      class="col s12 sub-block articles floatup-div wow animate__slideInUp"
      v-for="article in articleContent"
      :key="article.id"
      @click="link('article', article.id)"
    >
      <div class="title">{{ article.title }}</div>
      <div class="username">
        <i class="material-icons">person</i>
        SeaotterMS
      </div>
      <div class="information">
        <i class="material-icons">edit</i>
        {{ article.createdAt }}
        <i class="material-icons">update</i>
        {{ article.updatedAt }}
      </div>
      <div class="tag">
        <div class="button-tags" v-for="(tag, index) in article.tags" :key="index" @click="tagClick(tag.name, $event)">
          {{ tag.name }}
        </div>
      </div>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
%basic-text-style {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.sub-block {
  max-height: 180px;
  height: 180px;
  cursor: pointer;
}

.banner {
  min-height: 250px;
  max-height: 250px;
  border: 2px solid var(--color-border);
  border-radius: 100px;
  margin-bottom: 20px;
  text-align: center;
  background-image: var(--image-banner);
  background-size: cover;
  background-position: 50% 20%;
  position: relative;
  > div {
    min-height: 100%;
    max-height: 100%;
    border: 2px solid transparent;
    border-radius: 100px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: rgba(240, 248, 255, 0.5);
    > div {
      min-height: 100%;
      max-height: 100%;
      margin: 50px;
      word-wrap: break-word;
      font-size: 60px;
    }
  }
}

.articles {
  border: 2px solid var(--color-border);
  border-radius: 20px;
}
.title {
  @extend %basic-text-style;
  font-size: 30px;
}
.information {
  @extend %basic-text-style;
}
.tag {
  @extend %basic-text-style;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  > div {
    margin-left: 5px;
  }
}
</style>
