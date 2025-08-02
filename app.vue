<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  const bar = document.getElementById("loader");
  if (bar) {
    setTimeout(() => {
      bar.classList.add("loading-hidden");
    }, 300);
  }
  // @ts-ignore
  if (window.WOW) {
    // @ts-ignore
    new WOW().init();
  }
});
</script>

<template>
  <div id="loader">
    <div class="loader"></div>
  </div>
  <div class="sticky-navbar">
    <NavBar />
  </div>
  <div class="row">
    <div class="col l9 m12 s12">
      <NuxtPage />
    </div>
    <div class="col l3 m12 s12 sticky-profile">
      <MyProfile />
    </div>
  </div>
</template>

<style lang="scss">
html,
body {
  min-height: 100vh;
  min-width: 768px;

  background-color: var(--color-background);
  background-size: 400% 400%;
}

.main-block {
  padding: 40px;
}

.sub-block {
  padding-top: 20px;
  margin-top: 10px;
  cursor: default !important;
  border: 2px solid var(--color-border);
  border-radius: 20px;
  display: inline-block;
  word-wrap: break-word;
  word-break: break-word;
}

.sticky-navbar {
  position: sticky;
  top: 0px;
  z-index: 10;
}

.sticky-profile {
  position: sticky;
  top: 70px;
}

.browser-default {
  background-color: var(--color-background);
  font-size: 15px;
  font-family: "Cubic_11_1.100_R";
}

/* hide materializecss select in mobile */
.mobile-hidden {
  display: block !important;
}
.mobile-display {
  display: none !important;
}
@media (max-width: 768px) {
  .mobile-display {
    display: block !important;
  }
  .mobile-hidden {
    display: none !important;
  }
}

.loading-hidden {
  display: none !important;
}
</style>
