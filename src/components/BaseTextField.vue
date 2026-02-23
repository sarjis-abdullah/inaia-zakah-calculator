<template>
  <div class="zakat-input-group">
    <div class="label-row">
      <label>{{ label }}</label>
      <!-- <span class="exempt-link">Approx Equivalent</span> -->
    </div>

    <div class="input-wrapper">
      <span class="prefix-badge">{{ prefix }}</span>

      <input
        type="number"
        class="custom-input"
        v-model="goldAmount"
        placeholder="0.0"
      />

      <!-- <span class="suffix-text"
          >≈
          {{
            getCurrencySymbol(appCurrency) + " " + goldEquivalentCurrencyValue
          }}</span
        > -->
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  label: String,
  prefix: String,
  suffix: String,
  placeholder: {
    type: String,
    default: "0.0",
  },
  type: {
    type: String,
    default: "number",
  },
});

defineEmits(["update:modelValue"]);
</script>

<style scoped>
.zakat-input-group {
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
    sans-serif;
  max-width: 500px; /* Adjust width as needed */
  /* margin: 20px; */
  /* margin-left: auto;
  margin-right: auto; */
}
.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #111;
}
/* 3. The Main Input Box Wrapper */
.input-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #e5e7eb; /* Light gray border */
  border-radius: 12px; /* Rounded corners like image */
  padding: 10px;
  background-color: #fff;
  transition: border-color 0.2s;
}

/* Focus state for the wrapper (optional UX improvement) */
.input-wrapper:focus-within {
  border-color: #059669; /* Green border on focus */
  box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
}

/* 4. Left Prefix (The 'g' or '$' box) */
.prefix-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6; /* Light gray background */
  color: #374151; /* Dark gray text */
  width: 32px;
  height: 32px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0; /* Prevents squishing */
  user-select: none;
}

/* 5. The Actual Input Field */
.custom-input {
  flex-grow: 1; /* Takes up remaining space */
  border: none;
  outline: none;
  font-size: 18px;
  padding: 0 12px;
  color: #111;
  width: 100px; /* Minimum width */
  background: transparent;
}

/* Remove default number arrows in Webkit browsers */
.custom-input::-webkit-inner-spin-button,
.custom-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* 6. Right Suffix (The calculated value) */
.suffix-text {
  color: #6b7280; /* Muted gray text */
  font-size: 16px;
  white-space: nowrap; /* Keeps price on one line */
  pointer-events: none; /* User clicks through to input */
}
label {
  color: #111;
  font-weight: 500;
}
</style>
