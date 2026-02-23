<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-left">
        <div class="">
          <a class="logo" href="/de/"
            ><img src="/logo.png" alt="INAIA" class="logo"
          /></a>
        </div>
        <!-- <span class="brand-name">Zakat Calculator</span> -->
      </div>

      <div class="nav-right">
        Zakat Calculator
        <div class="lang-selector" v-if="false">
          <button @click="setLang('en')" :class="{ active: lang === 'en' }">
            <img src="https://flagcdn.com/w20/gb.png" alt="English" /> EN
          </button>
          <span class="divider">|</span>
          <button @click="setLang('de')" :class="{ active: lang === 'de' }">
            <img src="https://flagcdn.com/w20/de.png" alt="Deutsch" /> DE
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
const lang = ref("en"); // default language

const setLang = (val) => {
  lang.value = val;
  // You can later add logic here to change the text of the app
};
</script>

<style scoped>
/* Navbar Styling */
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
  font-weight: 600;
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
</style>
