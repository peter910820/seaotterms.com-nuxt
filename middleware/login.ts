export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return;

  const userStore = useUserStore();

  const session = useCookie("blog-userinfo-session", {
    path: "/",
    maxAge: 0,
    sameSite: "none",
    domain: import.meta.env.VITE_ROOT_DOMAIN,
  });
  session.value = null;
  userStore.reset();
});
