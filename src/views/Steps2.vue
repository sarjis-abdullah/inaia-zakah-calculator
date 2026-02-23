<script setup>
import { ref, computed, reactive } from "vue";

// 1. App State
const currentStep = ref(1);
const nisabLimit = 11458.82; // Example static value
const goldPricePerGram = 65.5; // Fetch from API in a real app
const silverPricePerGram = 0.85;

const form = reactive({
  money: 0,
  goldWeight: 0,
  silverWeight: 0,
  debts: 0,
});

// 2. Calculations
const totalAssets = computed(() => {
  return (
    form.money +
    form.goldWeight * goldPricePerGram +
    form.silverWeight * silverPricePerGram
  );
});

const zakatableAmount = computed(() => {
  const net = totalAssets.value - form.debts;
  return net > 0 ? net : 0;
});

const zakatDue = computed(() => {
  if (zakatableAmount.value >= nisabLimit) {
    return (zakatableAmount.value * 0.025).toFixed(2);
  }
  return 0;
});

// 3. Navigation
const nextStep = () => currentStep.value++;
const prevStep = () => currentStep.value--;
</script>
<template>
  <div class="zakat-card">
    <div class="progress-container">
      <div
        v-for="step in 4"
        :key="step"
        :class="['step-dot', { active: currentStep >= step }]"
      ></div>
    </div>

    <div v-if="currentStep === 1" class="fade-in">
      <h2 class="step-title">Choose below what applies to you.</h2>
      <p class="step-desc">
        Below you will see the assets subject to zakat and the deductible debts.
        <span v-if="false"
          >Are you unsure about one or more options? Select them anyway to
          receive more information in a later step.</span
        >
      </p>
      <div class="checkbox-group">
        <label class="custom-checkbox">
          <input type="checkbox" checked /> <span>Gold and Silver</span>
        </label>
        <label class="custom-checkbox">
          <input type="checkbox" checked /> <span>Money / Savings</span>
        </label>
      </div>
    </div>

    <div v-if="currentStep === 2" class="fade-in">
      <h2 class="step-title">
        Please enter the amount of money you currently have.
      </h2>
      <p class="step-desc">
        Enter the total amount of your assets below, including checking, savings
        accounts and savings under your mattress.
      </p>
      <div class="input-wrapper">
        <span class="currency-symbol">€</span>
        <input
          v-model.number="form.money"
          type="number"
          class="main-input"
          placeholder="0.00"
        />
      </div>
    </div>

    <div v-if="currentStep === 3" class="fade-in">
      <header>
        <h2 class="step-title">Gold and silver value</h2>
        <p>
          Enter the current market value of your gold and silver holdings here.
          If you don't know the value, you can also enter the weight in grams
          (switch to grams to do this).
        </p>
      </header>
      <div class="form-grid">
        <div class="field">
          <label>Gold (Grams)</label>
          <input
            v-model.number="form.goldWeight"
            type="number"
            placeholder="0"
          />
        </div>
        <div class="field">
          <label>Silver (g)</label>
          <input
            v-model.number="form.silverWeight"
            type="number"
            placeholder="0"
          />
        </div>
        <!-- <div class="field full">
          <label>Deductible Debts (€)</label>
          <input v-model.number="form.debts" type="number" placeholder="0.00" />
        </div> -->
      </div>
    </div>

    <div v-if="currentStep === 4" class="fade-in">
      <h2 class="step-title">Your Zakat Calculation</h2>
      <div class="result-box">
        <div class="row">
          <span>Total Assets:</span> <span>€{{ totalAssets.toFixed(2) }}</span>
        </div>
        <div class="row debt">
          <span>Minus Debts:</span> <span>-€{{ form.debts.toFixed(2) }}</span>
        </div>
        <div class="row total">
          <span>Net Wealth:</span>
          <span>€{{ zakatableAmount.toFixed(2) }}</span>
        </div>
      </div>

      <div class="nisab-status">
        <p>Current Nisab: €{{ nisabLimit }}</p>
        <div v-if="zakatableAmount >= nisabLimit" class="zakat-badge due">
          The Zakat (2.5%) on your wealth is:<span style="font-size: 20px"
            >€{{ zakatDue }}</span
          >
        </div>
        <div v-else class="zakat-badge exempt">Below Nisab Threshold</div>
      </div>
    </div>

    <div class="nav-buttons">
      <button v-if="currentStep > 1" @click="prevStep" class="btn-secondary">
        Back
      </button>
      <div v-else></div>
      <button v-if="currentStep < 4" @click="nextStep" class="btn-primary">
        Next
      </button>
      <button v-else @click="currentStep = 1" class="btn-primary">
        Restart
      </button>
    </div>
  </div>
</template>
<style scoped>
/* Container & Layout */
.zakat-card {
  max-width: 400px;
  margin: 40px auto;
  padding: 30px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  font-family: "Inter", sans-serif;
  border: 1px solid #f0f0f0;
}

/* Progress Dots */
.progress-container {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
}
.step-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #e0e0e0;
  transition: 0.3s;
}
.step-dot.active {
  background: #2563eb;
  transform: scale(1.2);
}

/* Typography */
.step-title {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 8px;
}
.step-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 25px;
}

/* Inputs */
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.currency-symbol {
  position: absolute;
  left: 15px;
  color: #999;
  font-weight: 600;
}
.main-input {
  width: 100%;
  padding: 15px 15px 15px 35px;
  font-size: 18px;
  border: 2px solid #eee;
  border-radius: 12px;
  outline: none;
}
.main-input:focus {
  border-color: #2563eb;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}
.field.full {
  grid-column: span 2;
}
.field label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 5px;
  color: #444;
}
.field input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
}

/* Results */
.result-box {
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
}
.row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.row.debt {
  color: #dc2626;
}
.row.total {
  border-top: 1px solid #ddd;
  padding-top: 10px;
  font-weight: 800;
  font-size: 18px;
}

.zakat-badge {
  padding: 15px;
  border-radius: 10px;
  font-weight: 700;
  text-align: center;
  margin-top: 15px;
}
.due {
  background: #dcfce7;
  color: #166534;
}
.exempt {
  background: #fef9c3;
  color: #854d0e;
}

/* Buttons */
.nav-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
}
.btn-primary {
  background: #2563eb;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}
.btn-secondary {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  font-weight: 500;
}

/* Animations */
.fade-in {
  animation: fadeIn 0.4s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
