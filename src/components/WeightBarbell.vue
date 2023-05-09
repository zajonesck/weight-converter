<template>
  <div class="WeightBarbell">
    <div class="plate" v-for="(plateCount, index) in plates" :key="index">
      <span
        v-for="n in plateCount"
        :key="n"
        :class="'plate-' + plateSizes[index]"
      >
        {{ plateSizes[index] }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "WeightBarbell",
  props: {
    totalWeight: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      plateSizes: [45, 35, 25, 10, 5, 2.5],
    };
  },
  computed: {
    plates() {
      let remainingWeight = (this.totalWeight - 45) / 2; // Subtract the weight of the bar (45 lbs) and divide by 2
      const plates = [];

      this.plateSizes.forEach((plateSize) => {
        const plateCount = Math.floor(remainingWeight / plateSize);
        remainingWeight -= plateCount * plateSize;
        plates.push(plateCount);
      });

      return plates;
    },
  },
};
</script>

<style scoped>
.WeightBarbell {
  display: flex;
  justify-content: center;
  align-items: center;
}

.plate {
  display: flex;
  justify-content: center;
  align-items: center;
}

.plate span {
  display: inline-block;
  margin: 0 4px;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #ccc;
  color: #333;
  font-weight: bold;
}

/* Add additional styles for different plate sizes if desired */
.plate-45 {
  background-color: #4caf50;
}

.plate-35 {
  background-color: #ff9800;
}

.plate-25 {
  background-color: #f44336;
}

.plate-10 {
  background-color: #9c27b0;
}

.plate-5 {
  background-color: #2196f3;
}

.plate-2_5 {
  background-color: #009688;
}
</style>
