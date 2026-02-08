import { defineStore } from "pinia";

export const useCurrencyStore = defineStore("currency", {
  state: () => ({
    currency: undefined,
  }),
  getters: {
    appCurrency(state) {
      return state.currency;
    },
  },
  actions: {
    async setCurrency(currency = "USD") {
      this.currency = currency;
    },
  },
});
