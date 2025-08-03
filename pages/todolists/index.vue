<script setup lang="ts">
definePageMeta({
  ssr: false,
  middleware: "require-auth",
});

import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { onMounted } from "vue";
import { initMaterialDatepicker, initMaterialFormSelect, initMaterialDropdown } from "@/composables/useMaterial";

import type { TodoRequest } from "@/types/request";
import type { CommonResponse, TodoQuery, TodoTopicQuery } from "@/types/response";

import { messageStorage } from "@/utils/messageHandler";

const router = useRouter();
const todoTopicStore = useTodoTopicStore();
const { todoTopic } = storeToRefs(todoTopicStore);
const todoStore = useTodoStore();
const { todo } = storeToRefs(todoStore);

const todoTopics = ref();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
const form = ref<TodoRequest>({
  owner: user.value.username,
  topic: "",
  title: "",
  status: 0,
  deadline: null,
  createName: user.value.username,
  updateName: "",
});

const todos = computed(() => todo.value);

onMounted(async () => {
  // get todo topic
  const responseTodoTopic = await $fetch<CommonResponse<TodoTopicQuery[]>>(`todo-topics/${user.value.username}`, {
    baseURL: import.meta.env.VITE_API_URL,
    method: "GET",
    credentials: "include",
  });

  if (responseTodoTopic) {
    todoTopicStore.set(responseTodoTopic.data);
  } else {
    router.push("/message");
  }
  todoTopics.value = todoTopic.value;

  // get todo
  const responseTodo = await $fetch<CommonResponse<TodoQuery[]>>(`todos/${user.value.username}`, {
    baseURL: import.meta.env.VITE_API_URL,
    method: "GET",
    credentials: "include",
  });
  if (responseTodo) {
    todoStore.set(responseTodo.data);
  } else {
    router.push("/message");
    return;
  }
  // init materializecss
  initMaterialDatepicker();
  initMaterialDropdown();
  initMaterialFormSelect();
});

// create
const handleSubmit = async () => {
  const deadlineTag = document.getElementById("deadline") as HTMLInputElement | null;
  if (deadlineTag) {
    const deadline = new Date(deadlineTag.value);
    form.value.deadline = deadline;
  } else {
    // 找不到ID為deadline的HTML元素
    messageStorage();
    router.push("/message");
    return;
  }
  if (confirm("確定新增?")) {
    if (form.value.topic.trim() === "" || form.value.title.trim() === "") {
      alert("請確保主題以及標題有正確填寫");
      return;
    }

    try {
      const response = await $fetch<CommonResponse<TodoQuery[]>>(`todos`, {
        baseURL: import.meta.env.VITE_API_URL,
        method: "POST",
        credentials: "include",
        body: form.value,
      });
      todoStore.set(response.data);
      form.value.owner = user.value.username;
    } catch (error) {
      errorHandler(error);
    }
  }
};

// update
const changeStatus = async (id: number, status: number) => {
  let statusText = "";
  switch (status) {
    case 0:
      statusText = "未開始";
      break;
    case 1:
      statusText = "進行中";
      break;
    case 2:
      statusText = "擱置中";
      break;
    case 3:
      statusText = "已完成";
      break;
  }
  if (confirm(`確定調整狀態為${statusText}?`)) {
    try {
      const response = await $fetch<CommonResponse<TodoQuery[]>>(`todos/${id}`, {
        baseURL: import.meta.env.VITE_API_URL,
        method: "PATCH",
        credentials: "include",
        body: {
          status: status,
          updateName: user.value.username,
        },
      });
      todoStore.set(response.data);
    } catch (error) {
      errorHandler(error);
    }
  }
};

// delete
const deleteTodo = async (id: number) => {
  if (confirm("確定刪除?")) {
    try {
      const response = await $fetch<CommonResponse<TodoQuery[]>>(`todos/${id}`, {
        baseURL: import.meta.env.VITE_API_URL,
        method: "DELETE",
        credentials: "include",
      });
      todoStore.set(response.data);
    } catch (error) {
      errorHandler(error);
    }
  }
};
</script>

<template>
  <div class="row main-block">
    <h1>待辦清單</h1>
    <span class="hint">*按鈕切換狀態>> N: 未開始 P: 進行中 S: 擱置中 C: 已完成 D: 刪除</span>
    <div class="col s12 add-block floatup-div wow animate__slideInUp">
      <div class="col s2 input-field mobile-hidden">
        <select v-model="form.topic">
          <option class="validate" value="" disabled selected>選擇主題</option>
          <option
            v-for="todoTopic in todoTopics"
            :key="todoTopic.topicName"
            :value="`${todoTopic.topicName}/${form.owner}`"
          >
            {{ todoTopic.topicName }}
          </option>
        </select>
        <label>選擇主題</label>
      </div>
      <div class="col s2 input-field mobile-display">
        <select v-model="form.topic" class="browser-default">
          <option class="validate" value="" disabled selected>選擇主題</option>
          <option
            v-for="todoTopic in todoTopics"
            :key="todoTopic.topicName"
            :value="`${todoTopic.topicName}/${form.owner}`"
          >
            {{ todoTopic.topicName }}
          </option>
        </select>
      </div>
      <div class="col s5 input-field">
        <input v-model="form.title" id="todo-title" type="text" class="validate" required />
        <span class="helper-text" data-error="此欄不能為空" data-success=""></span>
        <label for="todo-title">標題</label>
      </div>
      <div class="col s3 input-field">
        <i class="material-icons prefix">browse_gallery</i>
        <input id="deadline" type="text" class="datepicker validate" />
        <label for="deadline">截止日期</label>
      </div>
      <div class="col s2 submit">
        <button class="button-submit" type="button" @click="handleSubmit">
          新增
          <i class="material-icons right">send</i>
        </button>
      </div>
    </div>

    <div class="col s12 sub-block floatup-div wow animate__slideInUp" v-for="todo in todos" :key="todo.id">
      <!-- todo-title -->
      <div :class="['col', todo.deadline ? 's5' : 's7', 'todo-title']">[{{ todo.topic }}]{{ todo.title }}</div>
      <!-- todo-deadline -->
      <div v-if="todo.deadline" class="col s2 todo-deadline">
        {{ todo.deadline.toISOString().split("T")[0] }}
      </div>
      <!-- todo-button -->
      <div class="col s3 todo-button">
        <span :class="['button-status', todo.status == 0 ? 'background-n' : '']" @click="changeStatus(todo.id, 0)">
          N
        </span>
        <span :class="['button-status', todo.status == 1 ? 'background-p' : '']" @click="changeStatus(todo.id, 1)">
          P
        </span>
        <span :class="['button-status', todo.status == 2 ? 'background-s' : '']" @click="changeStatus(todo.id, 2)">
          S
        </span>
        <span :class="['button-status', todo.status == 3 ? 'background-c' : '']" @click="changeStatus(todo.id, 3)">
          C
        </span>
        <span class="button-status background-d" @click="deleteTodo(todo.id)">D</span>
      </div>
      <!-- todo-status -->
      <div v-if="todo.status === 0" class="col s2 todo-status">
        <font color="red">未開始</font>
      </div>
      <div v-else-if="todo.status === 1" class="col s2 todo-status">
        <font color="blue">進行中</font>
      </div>
      <div v-else-if="todo.status === 2" class="col s2 todo-status">
        <font color="purple">擱置中</font>
      </div>
      <div v-else-if="todo.status === 3" class="col s2 todo-status">
        <font color="green">已完成</font>
      </div>
      <div v-else class="col s3 todo-status">?</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.add-block {
  font-size: 25px !important;
  max-height: 100px;
  height: 150px;
  padding-top: 10px;
  margin-top: 10px;
  cursor: default;
  border: 2px solid black;
  border-radius: 20px;
  > .submit {
    padding-top: 10px;
  }
}
.sub-block {
  font-size: 25px !important;
  max-height: 100px;
  height: 150px;
}

.todo-title {
  text-align: left;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  overflow: hidden !important;
}
.todo-button {
  margin-top: 0px !important;
  padding: 0px;
  text-align: left;
}
.todo-deadline {
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
}
.hint {
  color: red;
  font-size: 20px;
}
.background-n {
  background: linear-gradient(to bottom right, red, #ff2f13);
}
.background-p {
  background: linear-gradient(to bottom right, blue, #287be9);
}
.background-s {
  background: linear-gradient(to bottom right, purple, #9848f3);
}
.background-c {
  background: linear-gradient(to bottom right, green, #35fc4f);
}
.background-d {
  background: linear-gradient(to bottom right, black, #222121);
}
@media (max-width: 768px) {
  .add-block {
    font-size: 20px !important;
    max-height: 100px;
    height: 150px;
  }
  .sub-block {
    font-size: 20px !important;
    max-height: 100px;
    height: 150px;
  }
  .hint {
    font-size: 15px;
  }
}
</style>
