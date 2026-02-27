<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-left">
        <div class="">
          <a class="logo" href="https://www.inaia.finance/en/"
            ><img src="/logo.png" alt="INAIA" class="logo"
          /></a>
        </div>
        <!-- <span class="brand-name">Zakat Calculator</span> -->
      </div>

      <div class="nav-middle">
        <span class=""> Zakat Calculator </span>
      </div>

      <div class="nav-right">
        <select
          name="language"
          class="custom-input mr-2"
          @change="changeLanguage"
          v-model="currentLocale"
        >
          <option value="en">English</option>
          <option value="de">German</option>
          <option value="fr">French</option>
        </select>
        <button
          v-if="appPreviewState != 0"
          class="nav-action"
          @click="countStore.setPreviewState(0)"
        >
          {{ $t("calculate_zakat") }}
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="100%"
              height="100%"
              viewBox="0 0 22 16"
              fill="none"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
              role="img"
              style="width: 16px"
            >
              <path
                d="M1 7C0.447715 7 0 7.44772 0 8C0 8.55228 0.447715 9 1 9L1 7ZM21.7071 8.70711C22.0976 8.31658 22.0976 7.68342 21.7071 7.29289L15.3431 0.928932C14.9526 0.538408 14.3195 0.538408 13.9289 0.928932C13.5384 1.31946 13.5384 1.95262 13.9289 2.34315L19.5858 8L13.9289 13.6569C13.5384 14.0474 13.5384 14.6805 13.9289 15.0711C14.3195 15.4616 14.9526 15.4616 15.3431 15.0711L21.7071 8.70711ZM1 9L21 9V7L1 7L1 9Z"
                fill="white"
              ></path>
            </svg>
          </span>
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { on, ref, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useCountStore } from "@/stores/count";
import { useI18n } from "vue-i18n";
const { t, locale } = useI18n();

const countStore = useCountStore();
const { appPreviewState } = storeToRefs(countStore);

const router = useRouter();
const route = useRoute();

const currentLocale = ref(locale.value);
const changeLanguage = (event) => {
  const newLocale = event.target.value;
  router.push({
    ...route,
    name: route.name,
    params: { ...route.params, locale: newLocale },
  });
};

watch(
  () => locale.value,
  (o, n) => {
    if (o !== n) {
      currentLocale.value = locale.value;
    }
  },
  { immediate: true, deep: true },
);
</script>

<style scoped>
/* Navbar Styling */
.nav-middle {
  color: #006de3;
  font-weight: bold;
  font-size: 24px;
}
.navbar {
  background: #ffffff;
  /* border-bottom: 1px solid #eee; */
  padding: 0 20px;
  height: 70px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  padding-top: 1rem;
  max-width: 1000px;
  margin: 12px auto;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Logo Section */
.nav-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-circle {
  width: 35px;
  height: 35px;
  background: #2563eb;
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 14px;
}

.brand-name {
  font-weight: 700;
  font-size: 18px;
  color: #1a1a1a;
}

/* Language Selector */
.lang-selector {
  display: flex;
  align-items: center;
  background: #f8fafc;
  padding: 5px 12px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
}

.lang-selector button {
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  /* font-weight: 600; */
  color: #64748b;
  cursor: pointer;
  padding: 4px 8px;
  transition: 0.2s;
}

.lang-selector button img {
  border-radius: 2px;
  width: 18px;
}

.lang-selector button.active {
  color: #2563eb;
}

.lang-selector button:hover {
  color: #1e293b;
}

.divider {
  color: #e2e8f0;
  margin: 0 4px;
  font-size: 12px;
}

/* Mobile Responsiveness */
@media (max-width: 480px) {
  .brand-name {
    font-size: 14px;
  }
  .nav-container {
    padding: 0 5px;
  }
}

.logo {
  width: 159px;
  height: 50px;
}
.nav-action {
  border: none;
  background: none;
  font-size: 14px;
  /* font-weight: 600; */
  color: #64748b;
  cursor: pointer;
  border-radius: 24px;
  transition: all 0.2s ease;
  padding: 0.5rem 1rem;
  background: #006de3;
  color: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
}
.bold {
  font-weight: bold;
}
.custom-input {
  /* Dimensions & Shape */
  height: 100%;
  border-radius: 0.375rem; /* rounded-md */

  /* Colors & Borders */
  border-color: #006de3;
  /* background-color: transparent; */
  color: #6b7280; /* text-gray-500 */

  /* Spacing */
  padding-top: 0;
  padding-bottom: 0;

  /* Typography */
  font-size: 0.875rem; /* sm:text-sm */
  line-height: 1.25rem;

  color: #006de3;
  padding: 0.5rem 8px;
  border-radius: 16px;
}

/* Interaction States */
.custom-input:focus {
  border-width: 0; /* focus:border-0 */
  outline: 1px solid #006de3;
  outline-offset: 2px;
  box-shadow: 0 0 0 0 transparent; /* focus:ring-0 */
}
</style>
