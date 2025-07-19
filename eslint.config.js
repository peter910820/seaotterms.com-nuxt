// eslint.config.js
import { createConfigForNuxt } from "@nuxt/eslint-config/flat";
import pluginVue from "eslint-plugin-vue";
import pluginPrettier from "eslint-plugin-prettier";
import configPrettier from "eslint-config-prettier/flat";

export default createConfigForNuxt(
  {
    plugins: {
      vue: pluginVue,
      prettier: pluginPrettier,
    },
  },
  configPrettier,
);
