<!--App.vue-->
<template>
  <v-app id="app">
    <v-container style="min-height: calc(100vh - 100px)">
      <v-row justify="center" align="center">
        <v-col cols="12">
          <v-card class="pa-4" color="black">
            <v-card-title class="text-center headline"
              >Bar's Loaded</v-card-title
            >

            <v-text-field
              v-model.number="weight"
              type="number"
              :placeholder="placeholderText"
              color="accent"
              label="Weight"
              @input="convert"
            />

            <v-select
              v-model="barAndUnit"
              :items="barOptions"
              label="Bar and Unit"
              color="accent"
              @change="convert"
            />

            <v-card-text class="mt-3" v-if="output">
              {{ output }}
            </v-card-text>

            <weight-barbell
              :total-weight="weight"
              :unit="unit"
              :barWeight="barWeight"
              v-if="weight && weight > 0"
            />
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container fluid>
      <v-row>
        <v-col col="12">
          <v-footer absolute padless class="font-weight-medium" color="black">
            <v-row justify="space-between" align="center">
              <v-col cols="auto">
                <p>&copy; 2023 Zack Jones</p>
              </v-col>

              <v-col cols="auto" class="d-flex justify-end">
                <v-btn
                  text
                  color="white"
                  href="https://zackjones.xyz/"
                  class="px-1 py-1 ml-3"
                  target="_blank"
                >
                  About Zack
                </v-btn>
                <v-btn
                  text
                  color="white"
                  href="https://github.com/zajonesck/weight-converter/blob/main/README.md"
                  class="px-1 py-1 ml-3"
                  target="_blank"
                >
                  About Barbell Loader
                </v-btn>
              </v-col>
            </v-row>
          </v-footer>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
import WeightBarbell from "./components/WeightBarbell.vue";

export default {
  components: {
    WeightBarbell,
  },
  name: "MyPage",
  mounted() {
    document.title = "Bar's Loaded";
  },
  beforeUnmount() {
    document.title = "My app"; // reset title or set to something default
  },
  data() {
    return {
      weight: null,
      output: "",
      barAndUnit: "20-kilograms",
      barOptions: ["45-pounds", "20-kilograms", "15-kilograms"],
    };
  },
  computed: {
    placeholderText() {
      return this.unit === "pounds" ? "Weight in lbs" : "Weight in kgs";
    },
    barWeight() {
      return Number(this.barAndUnit.split("-")[0]);
    },
    unit() {
      return this.barAndUnit.split("-")[1];
    },
  },
  methods: {
    poundsToKilograms(pounds) {
      return pounds * 0.45359237;
    },
    kilogramsToPounds(kilograms) {
      return kilograms / 0.45359237;
    },
    convert() {
      let result;

      if (!isNaN(this.weight)) {
        if (this.unit === "pounds") {
          result = this.poundsToKilograms(this.weight);
          this.output = `${this.weight} Pounds is equal to ${result.toFixed(
            2
          )} Kilograms`;
        } else {
          result = this.kilogramsToPounds(this.weight);
          this.output = `${this.weight} Kilograms is equal to ${result.toFixed(
            2
          )} Pounds`;
        }
      } else {
        this.output = "Please enter a valid weight";
      }
    },
  },
};
</script>

<style>
body {
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  background-color: black;
  color: white;
  font-family: Arial, sans-serif;
}

#app {
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
