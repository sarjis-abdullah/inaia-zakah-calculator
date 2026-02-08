<template>
  <div class="zakat-input-group">
    <div class="label-row">
      <label>Gold</label>
      <a href="#" class="exempt-link">May be exempt</a>
    </div>

    <div class="input-wrapper">
      <span class="prefix-badge">g</span>

      <input
        type="number"
        class="custom-input"
        v-model="gramAmount"
        placeholder="0"
      />

      <span class="suffix-text"
        >≈ {{ getCurrencySymbol(appCurrency)
        }}{{ equivalentCurrencyValue }}</span
      >
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { getCurrencySymbol } from "@/hooks/useCurrencyHelper";

const
</script>

<style lang="scss" scoped></style>
