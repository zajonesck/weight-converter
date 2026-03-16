<!--App.vue-->
<template>
  <v-app>
    <v-app-bar elevation="4" color="surface">
      <v-app-bar-title>
        <span class="font-weight-bold text-primary" style="font-size: 1.25rem; letter-spacing: 0.01em">⚡ Elite Iron</span>
      </v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn variant="tonal" color="primary" size="small" class="mr-2 d-none d-sm-flex" @click="dialog = true">How to use</v-btn>
      <v-btn variant="tonal" color="primary" size="small" class="mr-2 d-flex d-sm-none" icon @click="dialog = true">?</v-btn>

      <v-dialog v-model="dialog" max-width="400">
        <v-card>
          <v-card-title class="pt-4 px-4">How to use</v-card-title>
          <v-card-text>
            <ol class="pl-4" style="line-height: 2">
              <li>Select your barbell type and unit system.</li>
              <li>Enter the total weight you want on the bar.</li>
              <li>The app calculates which plates to load on each side.</li>
            </ol>
          </v-card-text>
          <v-card-actions class="px-4 pb-4">
            <v-spacer></v-spacer>
            <v-btn variant="tonal" @click="dialog = false">Got it</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-app-bar>

    <v-main>
      <v-container style="min-height: calc(100vh - 164px); max-width: 700px">
        <v-row justify="center" align="start" class="mt-2">
          <v-col>
            <v-card rounded="lg" elevation="2" class="pa-2">
              <v-row dense class="px-2 pt-2">
                <v-col cols="12">
                  <v-select
                    v-model="barAndUnit"
                    :items="barOptions"
                    item-title="title"
                    item-value="value"
                    label="Barbell"
                    color="primary"
                    @update:modelValue="convert"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model.number="weight"
                    type="number"
                    :placeholder="placeholderText"
                    color="primary"
                    label="Target Weight"
                    @input="convert"
                  >
                    <template #prepend>
                      <v-btn
                        variant="tonal"
                        color="primary"
                        density="comfortable"
                        @click="decrementWeight"
                        style="min-width: 36px"
                      >−</v-btn>
                    </template>
                    <template #append>
                      <v-btn
                        variant="tonal"
                        color="primary"
                        density="comfortable"
                        @click="incrementWeight"
                        style="min-width: 36px"
                      >+</v-btn>
                    </template>
                  </v-text-field>
                </v-col>
                <v-col cols="12">
                  <div class="toggle-row">
                    <button
                      :class="['toggle-pill', { active: includeCollars }]"
                      @click="includeCollars = !includeCollars"
                    >🔒 {{ collarLabel }}</button>
                    <button
                      v-if="barWeight === 45 && unit === 'pounds'"
                      :class="['toggle-pill', { active: use35LbPlates }]"
                      @click="use35LbPlates = !use35LbPlates"
                    >🏋️ 35 lb plates</button>
                  </div>
                </v-col>
              </v-row>

              <!-- Empty state -->
              <div v-if="!weight || weight <= 0" class="text-center py-10 text-medium-emphasis">
                <div class="text-body-1">Enter a weight to see how to load the bar</div>
              </div>

              <!-- Normal display -->
              <weight-barbell
                v-else
                :total-weight="weight"
                :unit="unit"
                :barWeight="barWeight"
                :includeCollars="includeCollars"
                :use35LbPlates="use35LbPlates"
              />

              <div v-if="output && weight >= barWeight" class="text-center pb-3">
                <span class="text-caption text-medium-emphasis">{{ output }}</span>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer>
      <v-row justify="center" no-gutters>
        <v-btn
          href="https://www.eliteironsp.com/"
          class="px-1 py-1 ml-3"
          target="_blank"
          variant="text"
          size="small"
          color="primary"
        >Elite Iron Sports Performance</v-btn>
        <v-col class="text-center mt-4" cols="12">
          &copy; {{ new Date().getFullYear() }} — <strong>Elite Iron Sports Performance</strong>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import WeightBarbell from "./components/WeightBarbell.vue";

export default {
  components: { WeightBarbell },
  name: "MyPage",
  mounted() {
    document.title = "Elite Iron";
    this.convert();
  },
  watch: {
    barWeight(newVal) {
      this.weight = newVal;
      this.convert();
    },
  },
  beforeUnmount() {
    document.title = "Elite Iron";
  },
  data() {
    return {
      dialog: false,
      weight: 20,
      output: "",
      barAndUnit: "20-kilograms",
      includeCollars: false,
      use35LbPlates: true,
      barOptions: [
        { title: "45 lb bar", value: "45-pounds" },
        { title: "20 kg bar", value: "20-kilograms" },
        { title: "15 kg bar", value: "15-kilograms" },
      ],
    };
  },
  computed: {
    placeholderText() {
      return this.unit === "pounds" ? "e.g. 135" : "e.g. 60";
    },
    barWeight() {
      return Number(this.barAndUnit.split("-")[0]);
    },
    unit() {
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
      this.weight = (this.weight || 0) + this.increment;
      this.convert();
    },
    decrementWeight() {
      this.weight = Math.max(0, (this.weight || 0) - this.increment);
      this.convert();
    },
    convert() {
      if (!this.weight || isNaN(this.weight)) {
        this.output = "";
        return;
      }
      let result;
      if (this.unit === "pounds") {
        result = this.poundsToKilograms(this.weight);
        this.output = `${this.weight} lbs = ${result.toFixed(1)} kg`;
      } else {
        result = this.kilogramsToPounds(this.weight);
        this.output = `${this.weight} kg = ${result.toFixed(1)} lbs`;
      }
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
</style>
