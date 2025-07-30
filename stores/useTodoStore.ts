import { defineStore } from "pinia";
import { ref } from "vue";

import type { TodoTopicQuery, TodoQuery, SystemTodoQuery } from "~/types/response";

export const useTodoTopicStore = defineStore("todoTopic", () => {
  const todoTopic = ref<TodoTopicQuery[]>([]);
  const set = (data: TodoTopicQuery[]) => {
    todoTopic.value = data;
  };

  return {
    todoTopic,
    set,
  };
});

export const useTodoStore = defineStore("todo", () => {
  const todo = ref<TodoQuery[]>([]);
  const set = (data: TodoQuery[]) => {
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
  const systemTodo = ref<SystemTodoQuery[]>([]);
  const systemTodoSingle = ref<SystemTodoQuery | null>(null); // for details
  const set = (data: SystemTodoQuery[]) => {
    systemTodo.value = data;
  };
  const setSingle = (data: SystemTodoQuery[] | null) => {
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
