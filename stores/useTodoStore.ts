import { defineStore } from "pinia";
import { ref } from "vue";

import type { TodoTopicQueryResponse, TodoQueryResponse, SystemTodoQueryResponse } from "@/types/response";

export const useTodoTopicStore = defineStore("todoTopic", () => {
  const todoTopic = ref<TodoTopicQueryResponse[]>([]);
  const set = (data: TodoTopicQueryResponse[]) => {
    todoTopic.value = data;
  };

  return {
    todoTopic,
    set,
  };
});

export const useTodoStore = defineStore("todo", () => {
  const todo = ref<TodoQueryResponse[]>([]);
  const set = (data: TodoQueryResponse[]) => {
    const convertedTodo = data.map((todo) => ({
      ...todo,
      deadline: todo.deadline ? new Date(todo.deadline) : todo.deadline,
    }));
    todo.value = convertedTodo;
  };

  return {
    todo,
    set,
  };
});

export const useSystemTodoStore = defineStore("systemTodo", () => {
  const systemTodo = ref<SystemTodoQueryResponse[]>([]);
  const systemTodoSingle = ref<SystemTodoQueryResponse | null>(null); // for details
  const set = (data: SystemTodoQueryResponse[]) => {
    systemTodo.value = data;
  };
  const setSingle = (data: SystemTodoQueryResponse[] | null) => {
    if (!data || data.length === 0) {
      systemTodoSingle.value = null;
    } else {
      systemTodoSingle.value = data[0];
    }
  };

  return {
    systemTodo,
    set,
    systemTodoSingle,
    setSingle,
  };
});
