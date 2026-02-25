import { createI18n } from "vue-i18n";

import en from "./en.json";
import de from "./de.json";
import fr from "./fr.json";
// 2. Create i18n instance
const i18n = createI18n({
  legacy: false, // Set to false to use Composition API
  locale: "en", // default locale
  fallbackLocale: "en", // set fallback locale
  messages: { en, de, fr },
});

export default i18n;
