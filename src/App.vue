<script setup>
import { RouterLink, RouterView } from "vue-router";
import { storeToRefs } from "pinia";
import { useCurrencyStore } from "@/stores/currency";

const currencyStore = useCurrencyStore();
const { appCurrency } = storeToRefs(currencyStore);
import { getCurrencySymbol } from "@/hooks/useCurrencyHelper";
import Header from "@/components/Header.vue";
// const aaa = getCurrencySymbol();
</script>

<template>
  <header>
    <Header />
    <div class="" v-if="false">
      <nav
        style="
          margin-left: 17px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <section>
          <RouterLink to="/">Zakah Calculator</RouterLink>
          <!-- <RouterLink to="/about">About</RouterLink> -->
        </section>
        <section>
          <p>App Currency: {{ getCurrencySymbol(appCurrency) }}</p>
        </section>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
/* header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
} */
</style>
