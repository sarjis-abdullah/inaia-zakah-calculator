<script setup>
import { ref, computed } from "vue";
import { getCurrencySymbol } from "@/hooks/useCurrencyHelper";
import { useCurrencyStore } from "@/stores/currency";
import { storeToRefs } from "pinia";

const currencyStore = useCurrencyStore();
const { appCurrency } = storeToRefs(currencyStore);

const goldAmount = ref("");
const silverAmount = ref("");
const cashAmount = ref("");

const goldApiData = {
  fixing_gram: 132.76,
  fixing_ounce: 4129.36,
  currency: "EUR",
  price_date: "2026-02-06",
  created_at: "2026-02-07T08:10:04.000000Z",
};
const silverApiData = {
  fixing_gram: 2.04,
  fixing_ounce: 53.57,
  currency: "EUR",
  price_date: "2026-02-06",
  created_at: "2026-02-07T08:10:04.000000Z",
};

const goldEquivalentCurrencyValue = computed(() => {
  const amount = parseFloat(goldAmount.value);
  if (isNaN(amount) || amount <= 0) {
    return "0.00";
  }
  return (amount * goldApiData.fixing_gram).toFixed(2);
});

const silverEquivalentCurrencyValue = computed(() => {
  const amount = parseFloat(silverAmount.value);
  if (isNaN(amount) || amount <= 0) {
    return "0.00";
  }
  return (amount * silverApiData.fixing_gram).toFixed(2);
});

// 2. CONSTANTS
// Nisab is the threshold wealth must reach to be liable for Zakat.
// Standard Gold Nisab is 85 grams of 24k gold.
const GOLD_NISAB_GRAMS = 87.48;
const SILVER_NISAB_GRAMS = 612.36;

// Total Net Worth in EUR
const totalNetWorth = computed(() => {
  const gold = parseFloat(goldEquivalentCurrencyValue.value) || 0;
  const silver = parseFloat(silverEquivalentCurrencyValue.value) || 0;
  const cash = parseFloat(cashAmount.value) || 0;
  const total = gold + silver + cash;
  return total.toFixed(2);
});

// Nisab Threshold Value in EUR (85g * Current Gold Price)
const goldNisabThreshold = computed(() => {
  return GOLD_NISAB_GRAMS * goldApiData.fixing_gram;
});

const silverNisabThreshold = computed(() => {
  return SILVER_NISAB_GRAMS * silverApiData.fixing_gram;
});

// Is Zakat Due? (Total Wealth > Nisab)
const isZakatDue = computed(() => {
  const total = parseFloat(totalNetWorth.value);
  const goldNisab = parseFloat(goldNisabThreshold.value);
  const silverNisab = parseFloat(silverNisabThreshold.value);
  const cash = parseFloat(cashAmount.value) || 0;
  return total >= silverNisab;
});

// Zakat Payable (2.5%)
const zakatPayableEUR = computed(() => {
  if (!isZakatDue.value) return 0;
  return totalNetWorth.value * 0.025;
});

const formatCurrency = (val, currencyCode) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(val);
};
</script>

<template>
  <main>
    <div class="zakat-input-group">
      <div class="label-row">
        <label>Gold Weight</label>
        <span class="exempt-link">May be exempt</span>
      </div>

      <div class="input-wrapper">
        <span class="prefix-badge">g</span>

        <input
          type="number"
          class="custom-input"
          v-model="goldAmount"
          placeholder="0.0"
        />

        <span class="suffix-text"
          >≈
          {{
            getCurrencySymbol(appCurrency) + " " + goldEquivalentCurrencyValue
          }}</span
        >
      </div>
    </div>

    <div class="zakat-input-group">
      <div class="label-row">
        <label>Silver Weight</label>
        <span class="exempt-link">May be exempt</span>
      </div>

      <div class="input-wrapper">
        <span class="prefix-badge">g</span>

        <input
          type="number"
          class="custom-input"
          v-model="silverAmount"
          placeholder="0.0"
        />

        <span class="suffix-text"
          >≈
          {{
            getCurrencySymbol(appCurrency) + " " + silverEquivalentCurrencyValue
          }}</span
        >
      </div>
    </div>

    <div class="zakat-input-group">
      <div class="label-row">
        <label>Amount in Cash/Bank</label>
      </div>

      <div class="input-wrapper">
        <span class="prefix-badge">{{ getCurrencySymbol(appCurrency) }}</span>

        <input
          type="number"
          v-model="cashAmount"
          class="custom-input"
          placeholder="0.00"
        />

        <span class="suffix-text" v-if="false">≈ €0.00</span>
      </div>
    </div>
    <div class="container">
      <!-- Total Net Worth: {{ getCurrencySymbol(appCurrency) }}{{ totalNetWorth }} -->
      <div class="results-dashboard">
        <div class="row">
          <span>Total Net Worth:</span>
          <span>{{ formatCurrency(totalNetWorth, "EUR") }}</span>
        </div>

        <div class="row">
          <span>Gold Nisab ({{ GOLD_NISAB_GRAMS }}g):</span>
          <span>{{ formatCurrency(goldNisabThreshold, "EUR") }}</span>
        </div>

        <div class="row">
          <span>Silver Nisab ({{ SILVER_NISAB_GRAMS }}g):</span>
          <span>{{ formatCurrency(silverNisabThreshold, "EUR") }}</span>
        </div>

        <div v-if="isZakatDue" class="result-box payable">
          <h3>Zakat Payable (2.5%)</h3>
          <p class="amount">{{ formatCurrency(zakatPayableEUR, "EUR") }}</p>
          <small>Your wealth exceeds the Nisab.</small>
        </div>

        <div v-else class="result-box not-payable">
          <h3>No Zakat Due</h3>
          <p>
            Your total wealth is less than the Nisab threshold of
            {{ formatCurrency(goldNisabThreshold, "EUR") }}.
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.container {
  max-width: 500px;
  margin: 0 auto;
}
/* 1. Container for the whole input block */
.zakat-input-group {
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
    sans-serif;
  max-width: 500px; /* Adjust width as needed */
  margin: 20px;
  margin-left: auto;
  margin-right: auto;
}

/* 2. Top Row: Label and "May be exempt" link */
.label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 500;
  color: #111;
}

.exempt-link {
  font-size: 14px;
  color: #059669; /* Green color from image */
  text-decoration: none;
  cursor: pointer;
}
.exempt-link:hover {
  text-decoration: underline;
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

.results-dashboard {
  margin-top: 20px;
}
.row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}
.result-box {
  margin-top: 15px;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
}
.result-box.payable {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}
.result-box.not-payable {
  background-color: #fafafa;
  color: #666;
  border: 1px solid #eee;
}
.amount {
  font-size: 1.5em;
  font-weight: bold;
}
</style>
