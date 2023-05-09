<template>
  <div id="app">
    <h1>Weight Converter</h1>
    <input v-model.number="weight" type="number" placeholder="Enter weight" />
    <select v-model="unit">
      <option value="pounds">Pounds</option>
      <option value="kilograms">Kilograms</option>
    </select>
    <button @click="convert">Convert</button>
    <p>{{ output }}</p>
    <weight-barbell :total-weight="weightInPounds" v-if="weightInPounds > 0" />
  </div>
</template>

<script>
import WeightBarbell from "./components/WeightBarbell.vue";

export default {
  components: {
    WeightBarbell,
  },
  data() {
    return {
      weight: null,
      unit: "pounds",
      output: "",
    };
  },
  computed: {
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
    weightInPounds() {
      if (this.unit === "pounds") {
        return this.weight;
      } else {
        return this.kilogramsToPounds(this.weight);
      }
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
