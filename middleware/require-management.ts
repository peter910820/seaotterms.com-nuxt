export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return;

  const userStore = useUserStore();
  const { user } = storeToRefs(userStore);
  if (!user.value.management) {
    alert("使用者沒有權限");
    return navigateTo("/");
  }
});
