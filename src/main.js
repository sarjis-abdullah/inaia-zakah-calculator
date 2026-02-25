import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import i18n from "./i18n";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(i18n);
app.use(createPinia());
app.use(router);

router.beforeEach((to, from, next) => {
  const locale = to.params.locale;
  const supportedLocales = ["en", "fr", "de"]; // Define your supported list

  // 1. Check if the locale in the URL is valid
  if (!supportedLocales.includes(locale)) {
    // If invalid or missing, redirect to default (en) while keeping the intended path
    return next({ path: `/en${to.fullPath}` });
  }

  // 2. Set the i18n locale to match the URL
  i18n.global.locale.value = locale;

  next();
});

app.mount("#app");
