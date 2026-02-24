import { defineStore } from "pinia";

export const useCountStore = defineStore("count", {
  state: () => ({
    previwState: 1,
  }),
  getters: {
    appPreviewState(state) {
      return state.previwState;
    },
  },
  actions: {
    async setPreviewState(state = 1) {
      this.previwState = state;
    },
    nextPreviewState() {
      if (this.previwState < 4) {
        this.previwState++;
      } else {
        this.previwState = 0; // Reset to first preview step
      }
    },
  },
});
