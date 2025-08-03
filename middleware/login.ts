export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return;

  const userStore = useUserStore();

  const session = useCookie("blog-userinfo-session");
  session.value = null;
  userStore.reset();
});
