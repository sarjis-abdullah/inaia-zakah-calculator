<script setup>
import { ref, computed, reactive, onMounted } from "vue";
import BaseZakatInput from "@/components/BaseTextField.vue";
import ArrowIcon from "@/components/ArrowIcon.vue";
import { storeToRefs } from "pinia";
import { useCountStore } from "@/stores/count";

const countStore = useCountStore();
const { appPreviewState } = storeToRefs(countStore);

// 1. App State
const currentStep = ref(1);
const nisabLimit = 11458.82; // Example static value
const goldPricePerGram = ref(0); // Fetch from API in a real app
const silverPricePerGram = 0.85;

const form = reactive({
  money: null,
  goldWeight: null,
  silverWeight: null,
  debts: null,
  debts2: null,
});

// 3. Navigation
const nextStep = () => currentStep.value++;
const prevStep = () => currentStep.value--;

const metalUnit = ref("euro"); // Default selection

const setUnit = (val) => {
  metalUnit.value = val;
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
    title: "Deductible Debts",
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
const BASE_URL = "https://golddinar-api-staging.inaia.cloud/api/v1/";
const getGoldPrice = async () => {
  try {
    const response = await fetch(`${BASE_URL}gold-price/latest`);
    const data = await response.json();
    if (data && data.data && data.data.fixing_gram_eur) {
      goldPricePerGram.value = data.data.fixing_gram_eur;
    }
    return Promise.resolve(data);
  } catch (error) {
    console.error("Error fetching gold price:", error);
    return Promise.reject(error); // Fallback to static value
  }
};

const goldApiData = ref({
  fixing_gram_eur: 140.28,
  fixing_gram_gbp: 122.53,
  fixing_ounce_eur: 4363.06,
  fixing_ounce_gbp: 3811.25,
  type: "day",
  price_date: "2026-02-23",
  source: "lbma",
});
const silverApiData = ref({
  fixing_gram_eur: 2.04,
  fixing_gram_gbp: 1.78,
  fixing_ounce_eur: 53.57,
  fixing_ounce_gbp: 46.82,
  type: "day",
  price_date: "2026-02-23",
  source: "lbma",
});
const goldEquivalentCurrencyValue = computed(() => {
  const amount = parseFloat(form.goldWeight);
  if (isNaN(amount) || amount <= 0) {
    return "0.00";
  }
  if (metalUnit.value == "euro") {
    return amount.toFixed(2);
  }
  return (amount * goldApiData.value.fixing_gram_eur).toFixed(2);
});

const silverEquivalentCurrencyValue = computed(() => {
  const amount = parseFloat(form.silverWeight);
  if (isNaN(amount) || amount <= 0) {
    return "0.00";
  }
  if (metalUnit.value == "euro") {
    return amount.toFixed(2);
  }
  return (amount * silverApiData.value.fixing_gram_eur).toFixed(2);
});
const moneyAmount = computed(() => {
  const amount = parseFloat(form.money);
  if (isNaN(amount) || amount <= 0) {
    return "0.00";
  }
  return amount.toFixed(2);
});

// 2. CONSTANTS
// Nisab is the threshold wealth must reach to be liable for Zakat.
// Standard Gold Nisab is 85 grams of 24k gold.
const GOLD_NISAB_GRAMS = 87.48;
const SILVER_NISAB_GRAMS = 612.36;

// Total Net Worth in EUR
const debts = computed(() => {
  let totalDebts = parseFloat(form.debts) || 0;
  totalDebts += parseFloat(form.debts2) || 0;
  return totalDebts ? totalDebts.toFixed(2) : 0;
});
const totalNetWorth = computed(() => {
  const gold = parseFloat(goldEquivalentCurrencyValue.value) || 0;
  const silver = parseFloat(silverEquivalentCurrencyValue.value) || 0;
  const cash = parseFloat(form.money) || 0;
  const total = gold + silver + cash - debts.value;
  return total.toFixed(2);
});

// Nisab Threshold Value in EUR (85g * Current Gold Price)
const goldNisabThreshold = computed(() => {
  return (GOLD_NISAB_GRAMS * goldApiData.value.fixing_gram_eur).toFixed(2);
});

const silverNisabThreshold = computed(() => {
  return (SILVER_NISAB_GRAMS * silverApiData.value.fixing_gram_eur).toFixed(2);
});

// Is Zakat Due? (Total Wealth > Nisab)
const isZakatDue = computed(() => {
  const total = parseFloat(totalNetWorth.value);
  const goldNisab = parseFloat(goldNisabThreshold.value);
  const silverNisab = parseFloat(silverNisabThreshold.value);
  return total >= Math.min(goldNisab, silverNisab);
});

// Zakat Payable (2.5%)
const zakatPayableEUR = computed(() => {
  if (!isZakatDue.value) return 0;
  return (totalNetWorth.value * 0.025).toFixed(2);
});

const formatCurrency = (val, currencyCode = "EUR") => {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: currencyCode,
  }).format(val);
};
const nextPreviewStep = () => {
  countStore.nextPreviewState();
};
const restart = () => {
  currentStep.value = 1;
  form.money = null;
  form.goldWeight = null;
  form.silverWeight = null;
  form.debts = null;
  form.debts2 = null;
  options.value.forEach((option) => (option.selected = false));
};

onMounted(() => {
  getGoldPrice();
});
</script>
<template>
  <section class="container">
    <div class="zakat-card">
      <section v-if="appPreviewState > 0">
        <div v-if="appPreviewState === 1" class="fade-in">
          <h2 class="step-title">Calculate your Zakat!</h2>
          <p class="step-desc">
            Zakat is one of the most important pillars in Islam. We support you
            with the calculation and payment.
          </p>
        </div>

        <div v-if="appPreviewState === 2" class="fade-in">
          <h2 class="step-title">Choose your assets</h2>
          <p class="step-desc">
            Zakat is paid on certain assets. Select your assets in the
            calculator and enter their value.
          </p>
        </div>
        <div v-if="appPreviewState === 3" class="fade-in">
          <h2 class="step-title">Determine the purpose of your Zakat .</h2>
          <p class="step-desc">
            Your Zakat changes lives. Decide for yourself where your Zakat
            should be used. Alternatively, you can leave the decision to Zakat
            Germany. That's also possible!
          </p>
        </div>
        <div v-if="appPreviewState === 4" class="fade-in">
          <h2 class="step-title">Completion and payment of your Zakat</h2>
          <p class="step-desc">
            We provide you with a transparent overview of your calculation and
            Zakat payment. This way, you can fulfill the third pillar of your
            faith with a clear conscience.
          </p>
        </div>

        <div>
          <div
            class="flex gap-1 wrap"
            :class="appPreviewState < 4 ? 'justify-between' : 'justify-end'"
          >
            <button
              v-if="appPreviewState < 4"
              @click="countStore.setPreviewState(0)"
              class="tab-btn"
            >
              Skip preview!
            </button>
            <button
              @click="nextPreviewStep"
              class="tab-btn active-tab calculate-btn"
            >
              <span v-if="appPreviewState == 1"
                >Calculate Zakat in few steps</span
              >
              <span v-else-if="appPreviewState == 2">Next Step</span>
              <span v-else-if="appPreviewState == 3">Next Step</span>
              <span v-else-if="appPreviewState == 4"
                >Calculate your Zakat now</span
              >
              <ArrowIcon />
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
          <h2 class="step-title">Belows are what applies to you.</h2>
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
              :class="['tab-btn p-3 active-tab']"
              style="border: 1px solid white"
            >
              {{ value.title }}
            </button>
          </div>
        </div>

        <section>
          <div class="fade-in" v-if="currentStep == 3">
            <h2 class="step-title">
              Enter the amount of money you currently have.
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

          <div class="fade-in" v-else-if="currentStep == 2">
            <header>
              <h2 class="step-title">Gold and Silver Value</h2>
              <p>
                Enter the current market value of your gold and silver holdings
                here. If you don't know the value, you can also enter the weight
                in grams (switch to grams to do this).
              </p>
            </header>
            <div class="flex justify-end mt-4">
              <div class="tab-container">
                <button
                  @click="setUnit('euro')"
                  :class="[
                    'tab-btn px-2 py-1',
                    { 'active-tab': metalUnit === 'euro' },
                  ]"
                >
                  €
                </button>
                <button
                  @click="setUnit('gram')"
                  :class="[
                    'tab-btn p-1',
                    { 'active-tab': metalUnit === 'gram' },
                  ]"
                >
                  g
                </button>
              </div>
            </div>
            <div class="form-grid">
              <BaseZakatInput
                v-model="form.goldWeight"
                :label="metalUnit === 'euro' ? 'Gold Value' : 'Gold Weight'"
                :prefix="metalUnit === 'euro' ? '€' : 'g'"
                :placeholder="metalUnit === 'euro' ? '0.00' : '0.0'"
              />
              <BaseZakatInput
                v-model="form.silverWeight"
                :label="metalUnit === 'euro' ? 'Silver Value' : 'Silver Weight'"
                :prefix="metalUnit === 'euro' ? '€' : 'g'"
                :placeholder="metalUnit === 'euro' ? '0.00' : '0.0'"
              />
            </div>
          </div>
          <div class="fade-in" v-else-if="currentStep == 4">
            <header>
              <h2 class="step-title">Your Deductible Debts</h2>
              <p>
                Certain debts can be deducted.<span v-if="false">
                  Before you do this, we recommend clicking on the (?).</span
                >
                We advise you to be as conservative as possible in this regard.
              </p>
            </header>

            <div class="form-grid mt-8">
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
        </section>

        <div v-if="currentStep === 5" class="fade-in">
          <h2 class="step-title">Your Zakat Calculation</h2>
          <div class="result-box">
            <div class="row">
              <span>Total Assets:</span>
              <span>{{ formatCurrency(totalNetWorth) }}</span>
            </div>
            <div class="row" v-if="debts">
              <span>Minus Debts:</span>
              <span>-{{ formatCurrency(debts) }}</span>
            </div>
          </div>

          <div class="nisab-status">
            <p class="nisab-title">
              <span>Current Nisab:</span>
              <span class="bold pl-2">{{
                formatCurrency(silverNisabThreshold)
              }}</span>
            </p>
            <div v-if="isZakatDue" class="zakat-badge due">
              The Zakat (2.5%) on your wealth is:<span
                class="pl-2"
                style="font-size: 20px"
                >{{ formatCurrency(zakatPayableEUR) }}</span
              >
            </div>
            <div v-else class="zakat-badge exempt">Below Nisab Threshold</div>
          </div>
        </div>

        <div class="nav-buttons">
          <button
            v-if="currentStep > 1"
            @click="prevStep"
            class="btn-primary calculate-btn"
          >
            <ArrowIcon :right="true" />
            Previous
          </button>
          <div v-else></div>
          <button
            v-if="currentStep < 5"
            @click="nextStep"
            class="btn-primary flex gap-2 calculate-btn"
          >
            {{ currentStep === 4 ? "Look at my calculation" : "Next" }}
            <ArrowIcon />
          </button>
          <button v-else @click="restart" class="btn-primary calculate-btn">
            Restart
            <ArrowIcon />
          </button>
        </div>
      </section>
    </div>
    <section class="zakat-card" v-if="currentStep > 1">
      <div class="fade-in">
        <h2 class="overview-title">Overview of calculation</h2>

        <div class="result-box">
          <div v-if="form.goldWeight" class="overview-row">
            <span>Gold Value</span>
            <span>{{ formatCurrency(goldEquivalentCurrencyValue) }}</span>
          </div>

          <div v-if="form.silverWeight" class="overview-row">
            <span>Silver Value</span>
            <span>{{ formatCurrency(silverEquivalentCurrencyValue) }}</span>
          </div>

          <div v-if="form.money" class="overview-row">
            <span>Money</span>
            <span>{{ formatCurrency(form.money) }}</span>
          </div>
          <div v-if="debts" class="overview-row">
            <span>Debts</span>
            <span>-{{ formatCurrency(debts) }}</span>
          </div>
          <div
            v-if="totalNetWorth && !isNaN(totalNetWorth)"
            class="overview-row"
            style="border-top: 1px solid; padding-top: 1rem"
          >
            <span>Total Assets:</span>
            <span>{{ formatCurrency(totalNetWorth) }}</span>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>
<style scoped>
.container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  max-width: 1000px;
  margin: 0 auto;
}
.zakat-card {
  margin-top: 40px;
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
  font-size: 32px;
  /* font-weight: 700; */
  /* color: #006de3; */
  margin-bottom: 8px;
}
.overview-title {
  font-size: 20px;
  /* font-weight: 600; */
  color: #1a1a1a;
  margin-bottom: 12px;
  text-align: center;
}
.nisab-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 12px;
  text-align: center;
}
.step-desc {
  font-size: 16px;
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
  background: #006de3;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 16px;
  font-weight: 600;
  cursor: pointer;
}
.border-top-right-radius-4 {
  border-top-right-radius: 16px;
}
.border-bottom-right-radius-4 {
  border-bottom-right-radius: 16px;
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
  /* font-weight: 600; */
  color: #64748b;
  cursor: pointer;
  border-radius: 16px;
  transition: all 0.2s ease;
}

/* Active State (Blue) */
.tab-btn.active-tab {
  background: #006de3;
  color: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
}

.tab-btn:hover:not(.active-tab) {
  color: #1e293b;
}

/* Adjusting the grid for the tabs */
.calculate-btn {
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.p-3 {
  padding: 12px;
}
.overview-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}
.inactive-tab {
  border: 1px solid #00c8ff;
  color: #006de3;
}
</style>
