<!--App.vue-->
<template>
  <v-app>
    <v-app-bar app clipped-left>
      <v-app-bar-title>Bar's Loaded</v-app-bar-title>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <div class="text-center">
        <v-btn @click="dialog = true"> Open Instructions </v-btn>

        <v-dialog v-model="dialog" width="auto">
          <v-card>
            <v-card-text>
              <ul>
                <li>
                  In the first field, select the type of weight and bar you're
                  using.
                </li>
                <li>
                  In the second field, enter the desired weight to put on the
                  bar.
                </li>
                <li>
                  Bar's Loaded automatically rounds down to the closest 5-pound
                  or 2.5-kilogram increment if the weight isn't already.
                </li>
              </ul>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" block @click="dialog = false"
                >Close Dialog</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>

      <v-container style="min-height: calc(100vh - 100px)">
        <v-row justify="center" align="center">
          <v-col>
            <v-card>
              <v-select
                v-model="barAndUnit"
                :items="barOptions"
                label="Bar and Unit"
                color="accent"
                @change="convert"
              />

              <v-text-field
                v-model.number="weight"
                type="number"
                :placeholder="placeholderText"
                color="accent"
                label="Weight"
                @input="convert"
              />

              <weight-barbell
                :total-weight="weight"
                :unit="unit"
                :barWeight="barWeight"
                v-if="weight && weight > 0"
              />
              <v-card-text class="mt-3" v-if="output">
                {{ output }}
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-footer absolute padless class="font-weight-medium">
      <v-row justify="space-between" align="center">
        <v-col cols="auto">
          <p>&copy; 2023 Zack Jones</p>
        </v-col>

        <v-col class="d-flex justify-end">
          <v-btn
            text
            href="https://zackjones.xyz/"
            class="px-1 py-1 ml-3"
            target="_blank"
          >
            About Zack
          </v-btn>
          <v-btn
            text
            href="https://github.com/zajonesck/weight-converter/blob/main/README.md"
            class="px-1 py-1 ml-3"
            target="_blank"
          >
            About Bar's Loaded
          </v-btn>
        </v-col>
      </v-row>
    </v-footer>
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
      dialog: false,
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

<style></style>
