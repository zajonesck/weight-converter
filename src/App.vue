<template>
  <div id="app">
    <h1>Barbell Loader</h1>
    <input
      v-model.number="weight"
      type="number"
      :placeholder="placeholderText"
    />
    <select v-model="barAndUnit">
      <option value="45-pounds">45 Pound Bar</option>
      <option value="20-kilograms">20 kg Bar</option>
      <option value="15-kilograms">15 kg Bar</option>
    </select>
    <button @click="convert">Convert</button>
    <p>{{ output }}</p>
    <weight-barbell
      :total-weight="weight"
      :unit="unit"
      :barWeight="barWeight"
      v-if="weight && weight > 0"
    />
    <WeightTracker :userId="userId" />
  </div>
</template>

<script>
import WeightBarbell from "./components/WeightBarbell.vue";
import WeightTracker from "./components/WeightTracker.vue";

export default {
  components: {
    WeightBarbell,
    WeightTracker,
  },
  data() {
    return {
      userId: null,
      weight: null,
      output: "",
      barAndUnit: "20-kilograms",
    };
  },
  created() {
    this.userId = localStorage.getItem("userId"); // Fetch userId from localStorage
  },
  computed: {
    placeholderText() {
      return this.unit === "pounds" ? "Weight in lbs" : "Weight in kgs";
    },
    convertedWeight() {
      let result;

      if (!isNaN(this.weight)) {
        if (this.unit === "pounds") {
          result = this.poundsToKilograms(this.weight);
        } else {
          result = this.kilogramsToPounds(this.weight);
        }
      }

      return result;
    },
    weightInKilograms() {
      if (this.unit === "pounds") {
        return this.poundsToKilograms(this.weight);
      } else {
        return this.weight;
      }
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
  font-family: Arial, sans-serif; /* example of setting a default font */
}

/* You can also set these properties on your root component (e.g., #app for a Vue application) */

#app {
  justify-content: center;
  align-items: center;
  width: 80%; /* Adjust this as needed */
}
</style>
