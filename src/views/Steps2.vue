<script setup>
import { ref, computed, reactive } from "vue";
import BaseZakatInput from "@/components/BaseTextField.vue";

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
  debts2: 0,
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

const unit = ref("euro"); // Default selection

const setUnit = (val) => {
  unit.value = val;
};

const options = ref([
  {
    title: "Gold and Silver",
    id: 1,
    selected: false,
  },
  {
    title: "Money / Savings",
    id: 2,
    selected: false,
  },
  {
    title: "Deductible debts",
    id: 3,
    selected: false,
  },
]);
const selectOption = (id) => {
  options.value = options.value.map((option) => ({
    ...option,
    selected: option.id === id ? !option.selected : option.selected,
  }));
};
const steps = [1, 2, 3, 4, 5];
const previewStep = ref(1);
</script>
<template>
  <div class="zakat-card">
    <section v-if="previewStep > 0">
      <div v-if="previewStep === 1" class="fade-in">
        <h2 class="step-title">Calculate your Zakat!</h2>
        <p class="step-desc">
          Zakat is one of the most important pillars in Islam. We support you
          with the calculation and payment.
        </p>
        <div class="flex gap-1 wrap">
          <button @click="previewStep++" class="tab-btn p-3 active-tab">
            Preview: Zakat in few steps->
          </button>
        </div>
        <button @click="previewStep = 0" class="tab-btn p-3">
          Skip preview!
        </button>
      </div>

          :class="['tab-btn p-3', { 'active-tab': value.selected }]"
      <div v-if="previewStep === 2" class="fade-in">
        <h2 class="step-title">Choose your assets</h2>
        <p class="step-desc">
          Zakat is paid on certain assets. Select your assets in the calculator
          and enter their value.
        </p>
        <div class="flex gap-1 wrap">
          <button @click="previewStep++" class="tab-btn p-3 active-tab">
            Next
          </button>
        </div>
        <button @click="previewStep = 0" class="tab-btn p-3 active-tab">
          Skip preview!
        </button>
      </div>
      <div v-if="previewStep === 3" class="fade-in">
        <h2 class="step-title">Determine the purpose of your Zakat .</h2>
        <p class="step-desc">
          Your Zakat changes lives. Decide for yourself where your Zakat should
          be used. Alternatively, you can leave the decision to Zakat Germany.
          That's also possible!
        </p>
        <div class="flex gap-1 wrap">
          <button @click="previewStep++" class="tab-btn p-3 active-tab">
            Next
          </button>
        </div>
        <button @click="previewStep = 0" class="tab-btn p-3 active-tab">
          Skip preview!
        </button>
      </div>
      <div v-if="previewStep === 4" class="fade-in">
        <h2 class="step-title">Completion and payment of your Zakat</h2>
        <p class="step-desc">
          We provide you with a transparent overview of your calculation and
          Zakat payment. This way, you can fulfill the third pillar of your
          faith with a clear conscience.
        </p>
        <div class="flex gap-1 wrap">
          <button @click="previewStep = 0" class="tab-btn p-3 active-tab">
            Calculate your Zakat now!
          </button>
        </div>
      </div>
    </section>

    <section v-else>
      <div class="progress-container">
        <div
          v-for="step in steps"
          :key="step"
          :class="['step-dot', { active: currentStep >= step }]"
        ></div>
      </div>

      <div v-if="currentStep === 1" class="fade-in">
        <h2 class="step-title">Choose below what applies to you.</h2>
        <p class="step-desc">
          Below you will see the assets subject to zakat and the deductible
          debts.
          <span v-if="false"
            >Are you unsure about one or more options? Select them anyway to
            receive more information in a later step.</span
          >
        </p>
        <div class="flex gap-1 wrap">
          <button
            v-for="value in options"
            @click="selectOption(value.id)"
            :class="['tab-btn p-3', { 'active-tab': value.selected }]"
          >
            {{ value.title }}
          </button>
        </div>
      </div>

      <div v-if="currentStep === 2" class="fade-in">
        <h2 class="step-title">
          Please enter the amount of money you currently have.
        </h2>
        <p class="step-desc">
          Enter the total amount of your assets below, including checking,
          savings accounts and savings under your mattress.
        </p>
        <BaseZakatInput
          v-model="form.money"
          label="Enter Amount"
          prefix="€"
          placeholder="0.00"
        />
      </div>

      <div v-if="currentStep === 3" class="fade-in">
        <header>
          <h2 class="step-title">Gold and silver value</h2>
          <p>
            Enter the current market value of your gold and silver holdings
            here. If you don't know the value, you can also enter the weight in
            grams (switch to grams to do this).
          </p>
        </header>
        <div class="flex justify-end">
          <div class="tab-container">
            <button
              @click="setUnit('euro')"
              :class="['tab-btn px-2 py-1', { 'active-tab': unit === 'euro' }]"
            >
              €
            </button>
            <button
              @click="setUnit('gram')"
              :class="['tab-btn p-1', { 'active-tab': unit === 'gram' }]"
            >
              g
            </button>
          </div>
        </div>
        <div class="form-grid">
          <BaseZakatInput
            v-model="form.goldWeight"
            label="Gold Weight"
            :prefix="unit === 'euro' ? '€' : 'g'"
            :placeholder="unit === 'euro' ? '0.00' : '0.0'"
          />
          <BaseZakatInput
            v-model="form.silverWeight"
            label="Silver Weight"
            :prefix="unit === 'euro' ? '€' : 'g'"
            :placeholder="unit === 'euro' ? '0.00' : '0.0'"
          />
        </div>
      </div>
      <div v-if="currentStep === 4" class="fade-in">
        <header>
          <h2 class="step-title">Your deductible debts</h2>
          <p>
            Certain debts can be deducted.<span v-if="false">
              Before you do this, we recommend clicking on the (?).</span
            >
            We advise you to be as conservative as possible in this regard.
          </p>
        </header>

        <div class="form-grid">
          <BaseZakatInput
            v-model="form.debts"
            label="Loan (Max repayment in 12 months)"
            :prefix="'€'"
            placeholder="0.00"
          />
          <BaseZakatInput
            v-model="form.debts2"
            label="Overdue bills"
            :prefix="'€'"
            placeholder="0.00"
          />
        </div>
      </div>

      <div v-if="currentStep === 5" class="fade-in">
        <h2 class="step-title">Your Zakat Calculation</h2>
        <div class="result-box">
          <div class="row">
            <span>Total Assets:</span>
            <span>€{{ totalAssets.toFixed(2) }}</span>
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
        <button v-if="currentStep < 5" @click="nextStep" class="btn-primary">
          {{ currentStep === 4 ? "Look at my calculation" : "Next" }}
        </button>
        <button v-else @click="currentStep = 1" class="btn-primary">
          Restart
        </button>
      </div>
    </section>
  </div>
</template>
<style scoped>
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
  grid-template-columns: 1fr;
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

/* Tab Container */
.tab-container {
  display: flex;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 10px;
}

/* Individual Tab Buttons */
.p-1 {
  padding: 4px;
}
.tab-btn {
  border: none;
  background: none;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s ease;
}

/* Active State (Blue) */
.tab-btn.active-tab {
  background: #2563eb;
  color: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
}

.tab-btn:hover:not(.active-tab) {
  color: #1e293b;
}

/* Adjusting the grid for the tabs */
.form-grid {
  margin-top: 0;
}
.p-3 {
  padding: 12px;
}
</style>
