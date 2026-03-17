<!--App.vue-->
<template>
  <v-app>
    <v-app-bar elevation="0" color="background" style="border-bottom: 1px solid rgba(220,38,38,0.15);">
      <v-app-bar-title>
        <img :src="require('./assets/EIlogo.jpg')" style="height: 36px; vertical-align: middle; border-radius: 4px; mix-blend-mode: lighten;" />
        <span class="font-weight-bold text-primary" style="font-size: 1.25rem; letter-spacing: 0.01em; vertical-align: middle; margin-left: 8px;">Elite Iron</span>
      </v-app-bar-title>
      <v-spacer></v-spacer>

      <!-- Feature 8: Settings gear button -->
      <v-btn variant="text" size="small" class="mr-1" @click="settingsOpen = !settingsOpen" aria-label="Weight tree settings" icon>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <!-- pole -->
          <rect x="11" y="2" width="2" height="20" rx="1"/>
          <!-- base -->
          <rect x="7" y="20" width="10" height="2" rx="1"/>
          <!-- arms, widening toward bottom -->
          <rect x="8"  y="5"  width="8"  height="2" rx="1"/>
          <rect x="6"  y="10" width="12" height="2" rx="1"/>
          <rect x="4"  y="15" width="16" height="2" rx="1"/>
        </svg>
      </v-btn>

      <v-btn variant="tonal" color="primary" size="small" class="mr-2 d-none d-sm-flex" @click="dialog = true">How to use</v-btn>
      <v-btn variant="tonal" color="primary" size="small" class="mr-2 d-flex d-sm-none" icon @click="dialog = true">?</v-btn>

      <v-dialog v-model="dialog" max-width="400">
        <v-card>
          <v-card-title class="pt-4 px-4">How to use</v-card-title>
          <v-card-text>
            <ol class="pl-4" style="line-height: 2">
              <li>Select your bar from the dropdown — choose from preset bars or use a custom weight.</li>
              <li>Enter the total weight you want on the bar.</li>
              <li>The app shows which plates to load on each side.</li>

              <li>Tap the <strong>weight tree icon</strong> to set which plates you have and toggle collars.</li>
            </ol>
          </v-card-text>
          <v-card-actions class="px-4 pb-4">
            <v-spacer></v-spacer>
            <v-btn variant="tonal" @click="dialog = false">Got it</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app-bar>

    <!-- Feature 8: Settings navigation drawer -->
    <v-navigation-drawer v-model="settingsOpen" temporary location="right" width="280">
      <div class="pa-4">
        <div class="text-subtitle-1 font-weight-bold mb-3">Weight Tree</div>
        <div class="text-caption text-medium-emphasis mb-3">
          Plates available ({{ unit === 'pounds' ? 'lbs' : 'kg' }})
        </div>

        <!-- Pounds plates -->
        <div v-if="unit === 'pounds'" class="toggle-row" style="justify-content: flex-start; gap: 8px; flex-wrap: wrap;">
          <button
            v-for="size in [45, 35, 25, 10, 5, 2.5]"
            :key="'lbs-' + size"
            :class="['toggle-pill', { active: availablePlates.pounds[size] !== false }]"
            @click="togglePlate('pounds', size)"
            style="padding: 7px 14px; font-size: 0.82rem; display: flex; align-items: center; gap: 6px;"
          >
            <span :style="{ width: '10px', height: '10px', borderRadius: '2px', background: plateColor('pounds', size), display: 'inline-block', flexShrink: 0 }"></span>
            {{ size }} lbs
          </button>
        </div>

        <!-- Kilograms plates -->
        <div v-if="unit === 'kilograms'" class="toggle-row" style="justify-content: flex-start; gap: 8px; flex-wrap: wrap;">
          <button
            v-for="size in [25, 20, 15, 10, 5, 2.5, 1.25]"
            :key="'kg-' + size"
            :class="['toggle-pill', { active: availablePlates.kilograms[size] !== false }]"
            @click="togglePlate('kilograms', size)"
            style="padding: 7px 14px; font-size: 0.82rem; display: flex; align-items: center; gap: 6px;"
          >
            <span :style="{ width: '10px', height: '10px', borderRadius: '2px', background: plateColor('kilograms', size), display: 'inline-block', flexShrink: 0 }"></span>
            {{ size }} kg
          </button>
        </div>

        <div class="text-caption text-medium-emphasis mt-4 mb-2">Collars</div>
        <button
          :class="['toggle-pill', { active: includeCollars }]"
          @click="includeCollars = !includeCollars"
          style="padding: 7px 14px; font-size: 0.82rem;"
        >🔒 Include collars ({{ collarWeight }} {{ unit === 'pounds' ? 'lbs' : 'kg' }} each)</button>
      </div>
    </v-navigation-drawer>

    <v-main>
      <v-container class="px-3" style="min-height: calc(100vh - 164px); max-width: 700px">
        <v-row justify="center" align="start" class="mt-4">
          <v-col class="pa-0">
            <!-- Feature 5: Swipe touch handlers on the calculator card -->
            <v-card
              rounded="xl"
              elevation="0"
              color="surface"
              class="pa-4"

            >
              <v-row dense class="px-2 pt-2">
                <v-col cols="12" class="pb-0">
                  <div class="d-flex justify-center mb-3">
                    <img :src="require('./assets/TransparentLogo.png')" style="height: 44px;" />
                  </div>
                  <select v-model="barAndUnit" class="bar-select mb-2">
                    <option v-for="opt in barOptions" :key="opt.value" :value="opt.value">{{ opt.title }}</option>
                  </select>
                </v-col>

                <!-- Custom bar weight inputs -->
                <v-col v-if="barAndUnit === 'custom-custom'" cols="12" class="pt-0">
                  <v-text-field
                    v-model.number="customBarWeight"
                    type="number"
                    label="Bar weight"
                    color="primary"
                    density="compact"
                    hide-details
                    class="mb-2"
                  />
                  <div class="toggle-row" style="justify-content: center; gap: 8px; margin-bottom: 0;">
                    <button
                      :class="['toggle-pill', { active: customBarUnit === 'kilograms' }]"
                      @click="customBarUnit = 'kilograms'"
                      style="padding: 7px 14px; font-size: 0.82rem;"
                    >kg</button>
                    <button
                      :class="['toggle-pill', { active: customBarUnit === 'pounds' }]"
                      @click="customBarUnit = 'pounds'"
                      style="padding: 7px 14px; font-size: 0.82rem;"
                    >lbs</button>
                  </div>
                </v-col>

                <v-col cols="12" class="py-2">
                  <div class="text-caption text-medium-emphasis mb-3" style="letter-spacing: 0.1em; text-transform: uppercase; padding-left: 2px; text-align: center;">Weight</div>
                  <div class="weight-display">
                    <div class="weight-number">
                      <input
                        :value="weight || ''"
                        type="text"
                        inputmode="decimal"
                        class="weight-input"
                        :placeholder="placeholderText"
                        @focus="e => $nextTick(() => e.target.setSelectionRange(e.target.value.length, e.target.value.length))"
                        @input="e => { const v = parseFloat(e.target.value); weight = isNaN(v) ? null : v; }"
                        @blur="snapWeight"
                      />
                      <span class="weight-unit">{{ unit === 'pounds' ? 'lbs' : 'kg' }}</span>
                    </div>
                  </div>
                </v-col>
              </v-row>

              <!-- Empty state -->
              <div v-if="!weight || weight <= 0" class="text-center py-8">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="24" viewBox="0 0 200 60" style="opacity: 0.2; margin-bottom: 12px;">
                  <!-- barbell shape -->
                  <rect x="0" y="22" width="30" height="16" rx="3" fill="currentColor"/>
                  <rect x="30" y="26" width="140" height="8" rx="4" fill="currentColor"/>
                  <rect x="170" y="22" width="30" height="16" rx="3" fill="currentColor"/>
                </svg>
                <div class="text-body-2 text-medium-emphasis">Enter a weight above to see how to load the bar</div>
              </div>

              <!-- Normal display -->
              <weight-barbell
                v-else
                ref="barbellComp"
                :total-weight="weight"
                :unit="unit"
                :barWeight="barWeight"
                :includeCollars="includeCollars"
                :use35LbPlates="use35LbPlates"
                :availablePlates="availablePlates"
                @share="shareLifts"
              />

              <div v-if="output && weight >= barWeight" class="text-center pb-3">
                <v-chip size="small" variant="tonal" color="primary">{{ output }}</v-chip>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Feature 4: EI promo card — no outer anchor wrapper, two separate buttons -->
        <v-row justify="center" class="mt-6 mb-4">
          <v-col cols="12" style="max-width: 700px">
            <v-card rounded="lg" elevation="3" color="background" style="border: 1px solid #DC2626;" class="pa-5">
              <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; width: 100%;">
                <img :src="require('./assets/EIlogo.jpg')" style="height: 110px; border-radius: 6px;" />
                <div style="color: #fff; font-size: 1rem; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase;">Train with the best</div>
                <div style="display: flex; gap: 16px;">
                  <a href="https://www.instagram.com/eliteironsp/" target="_blank" style="color: rgba(255,255,255,0.75); text-decoration: none; font-size: 0.9rem; display: flex; align-items: center; gap: 6px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    @eliteironsp
                  </a>
                  <a href="https://www.facebook.com/eliteironsp/" target="_blank" style="color: rgba(255,255,255,0.75); text-decoration: none; font-size: 0.9rem; display: flex; align-items: center; gap: 6px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    eliteironsp
                  </a>
                </div>
                <v-btn
                  color="primary"
                  variant="elevated"
                  href="https://www.eliteironsp.com/"
                  target="_blank"
                  style="font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; width: 100%; white-space: normal; height: auto; min-height: 48px; padding: 10px 16px;"
                >Visit Elite Iron</v-btn>
                <v-btn
                  variant="outlined"
                  color="white"
                  href="https://www.eliteironsp.com/contact"
                  target="_blank"
                  style="font-weight: 700; letter-spacing: 0.04em; text-transform: uppercase; width: 100%; white-space: normal; height: auto; min-height: 48px; padding: 10px 16px;"
                >Book a Session</v-btn>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer style="border-top: 1px solid rgba(220,38,38,0.3);">
      <v-row justify="center" no-gutters class="py-2">
        <v-col class="text-center" cols="12">
          <span style="color: rgba(255,255,255,0.45); font-size: 0.8rem;">&copy; {{ new Date().getFullYear() }} Elite Iron Sports Performance</span>
        </v-col>
      </v-row>
    </v-footer>

    <!-- Feature 6: Snackbar for clipboard copy fallback -->
    <v-snackbar v-model="snackbar" timeout="2000">
      Copied to clipboard!
    </v-snackbar>
  </v-app>
</template>

<script>
import WeightBarbell from "./components/WeightBarbell.vue";

export default {
  components: { WeightBarbell },
  name: "MyPage",
  mounted() {
    document.title = "Elite Iron";
  },
  watch: {
    barWeight(newVal) {
      // Feature 3: guard — don't reset weight in custom mode
      if (!this.barAndUnit.startsWith('custom')) {
        this.weight = newVal;
      }
    },
    includeCollars(enabled) {
      if (this.weight === this.barWeight && enabled) {
        this.weight = this.barWeight + this.collarWeight * 2;
      } else if (this.weight === this.barWeight + this.collarWeight * 2 && !enabled) {
        this.weight = this.barWeight;
      }
    },
  },
  beforeUnmount() {
    document.title = "Elite Iron";
  },
  data() {
    return {
      dialog: false,
      weight: 20,
      barAndUnit: "20-kilograms",
      includeCollars: false,
      use35LbPlates: true,
      // Feature 3: Custom bar data
      customBarWeight: 20,
      customBarUnit: 'kilograms',
      barOptions: [
        { title: "45 lb bar", value: "45-pounds" },
        { title: "20 kg bar", value: "20-kilograms" },
        { title: "15 kg bar", value: "15-kilograms" },
        { title: "Custom bar", value: "custom-custom" },
      ],

      // Feature 6: Snackbar
      snackbar: false,
      // Feature 8: Settings drawer + plate inventory
      settingsOpen: false,
      availablePlates: {
        pounds: { 45: true, 35: true, 25: true, 10: true, 5: true, 2.5: true },
        kilograms: { 25: true, 20: true, 15: true, 10: true, 5: true, 2.5: true, 1.25: true },
      },
    };
  },
  computed: {
    output() {
      if (!this.weight || isNaN(this.weight)) return "";
      const barOnly = this.weight <= this.barWeight;
      const total = barOnly && this.includeCollars
        ? this.weight + this.collarWeight * 2
        : this.weight;
      if (this.unit === "pounds") {
        const kg = this.poundsToKilograms(total);
        return `${total} lbs = ${kg.toFixed(1)} kg`;
      } else {
        const lbs = this.kilogramsToPounds(total);
        return `${total} kg = ${lbs.toFixed(1)} lbs`;
      }
    },
    placeholderText() {
      return this.unit === "pounds" ? "e.g. 135" : "e.g. 60";
    },
    barWeight() {
      // Feature 3: custom bar support
      if (this.barAndUnit.startsWith('custom')) {
        return this.customBarWeight;
      }
      return Number(this.barAndUnit.split("-")[0]);
    },
    unit() {
      // Feature 3: custom bar unit support
      if (this.barAndUnit.startsWith('custom')) {
        return this.customBarUnit;
      }
      return this.barAndUnit.split("-")[1];
    },
    increment() {
      return this.unit === "pounds" ? 5 : 2.5;
    },
    collarWeight() {
      return this.unit === "pounds" ? 5 : 2.5;
    },
    collarLabel() {
      return `Collars (${this.collarWeight} ${this.unit === "pounds" ? "lbs" : "kg"} each)`;
    },
  },
  methods: {
    poundsToKilograms(pounds) {
      return pounds * 0.45359237;
    },
    kilogramsToPounds(kilograms) {
      return kilograms / 0.45359237;
    },
    incrementWeight() {
      // Feature 2: Haptic feedback
      if (navigator.vibrate) navigator.vibrate(10);
      this.weight = (this.weight || 0) + this.increment;
    },
    decrementWeight() {
      // Feature 2: Haptic feedback
      if (navigator.vibrate) navigator.vibrate(10);
      this.weight = Math.max(this.barWeight, (this.weight || 0) - this.increment);
    },
    // Feature 5: Swipe gesture handlers
    snapWeight() {
      if (!this.weight) return;
      const snapped = Math.round((this.weight - this.barWeight) / this.increment) * this.increment + this.barWeight;
      this.weight = Math.max(this.barWeight, snapped);
    },
    // Feature 6: Branded share
    async shareLifts() {
      const comp = this.$refs.barbellComp;
      const summary = comp ? comp.platesSummary : '';
      const unit = this.unit === 'pounds' ? 'lbs' : 'kg';
      const text = `🏋️ ${this.weight} ${unit} at Elite Iron Sports Performance!\nPlates per side: ${summary}\n\nPowered by Bar's Loaded`;
      const url = 'https://www.eliteironsp.com/';
      try {
        if (navigator.share) {
          await navigator.share({ title: "Bar's Loaded – Elite Iron", text, url });
        } else {
          await navigator.clipboard.writeText(text + '\n' + url);
          this.snackbar = true;
        }
      } catch (e) {
        // share cancelled or unavailable
      }
    },
    // Change 7: Plate color swatches
    plateColor(unitKey, size) {
      const map = {
        pounds: { 45: '#3f53f5', 35: '#e0c000', 25: '#28b828', 10: '#e0e0e0', 5: '#333', 2.5: '#888' },
        kilograms: { 25: '#dd2828', 20: '#3f53f5', 15: '#e0c000', 10: '#28b828', 5: '#e0e0e0', 2.5: '#333', 1.25: '#888' }
      };
      return map[unitKey]?.[size] || '#888';
    },
    // Feature 8: Toggle plate availability
    togglePlate(unitKey, size) {
      const current = this.availablePlates[unitKey][size];
      // Use Vue reactivity-safe update
      this.availablePlates = {
        ...this.availablePlates,
        [unitKey]: {
          ...this.availablePlates[unitKey],
          [size]: current === false ? true : false,
        },
      };
    },
  },
};
</script>

<style>
.toggle-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 0 4px 8px;
  justify-content: center;
}

.toggle-pill {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.18s ease;
  user-select: none;
}

.toggle-pill:hover {
  border-color: #DC2626;
  background: rgba(220, 38, 38, 0.12);
  color: #fff;
}

.toggle-pill.active {
  border-color: #DC2626;
  background: #DC2626;
  color: #fff;
  font-weight: 600;
}

/* Modern bar selector */
.bar-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  padding-bottom: 4px;
}

.bar-pill {
  flex-shrink: 0;
  padding: 8px 16px;
  border-radius: 999px;
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
}
.bar-pill:hover {
  border-color: rgba(220, 38, 38, 0.5);
  color: rgba(255,255,255,0.9);
}
.bar-pill.active {
  border-color: #DC2626;
  background: rgba(220, 38, 38, 0.15);
  color: #fff;
  font-weight: 600;
}

/* Large weight display */
.weight-display {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
.weight-btn {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.05);
  color: rgba(255,255,255,0.8);
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.weight-btn:hover {
  border-color: #DC2626;
  background: rgba(220,38,38,0.15);
  color: #fff;
}
.weight-btn:active {
  background: rgba(220,38,38,0.3);
  transform: scale(0.95);
}
.weight-number {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
.weight-input {
  background: rgba(255,255,255,0.06);
  border: 1.5px solid rgba(255,255,255,0.2);
  border-radius: 12px;
  outline: none;
  color: #fff;
  font-size: 2.8rem;
  font-weight: 700;
  text-align: center;
  width: 100%;
  padding: 14px 16px 10px;
  line-height: 1;
  transition: border-color 0.15s ease, background 0.15s ease;
  -moz-appearance: textfield;
}
.weight-input:focus {
  border-color: #DC2626;
  background: rgba(220,38,38,0.08);
}
.weight-input::-webkit-outer-spin-button,
.weight-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.weight-input::placeholder {
  color: rgba(255,255,255,0.2);
}
.weight-unit {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.4);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-top: 6px;
}

.bar-select {
  width: 100%;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1.5px solid rgba(255,255,255,0.2);
  background: rgba(255,255,255,0.06);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 500;
  text-align: center;
  text-align-last: center;
  appearance: none;
  cursor: pointer;
  outline: none;
  transition: border-color 0.15s ease;
}
.bar-select:focus {
  border-color: #DC2626;
}
.bar-select option {
  background: #1a1a1a;
  color: #fff;
}
</style>
