<template>
  <div class="barbell">
    <div class="barbell-side"></div>
    <div class="plates">
      <div
        v-for="(plateCount, index) in plates"
        :key="index"
        class="plate-group"
      >
        <div
          v-for="n in plateCount"
          :key="n"
          :class="'plate plate-' + plateSizes[index]"
        ></div>
      </div>
    </div>
    <div class="barbell-bar"></div>
    <div class="plates">
      <div
        v-for="(plateCount, index) in plates"
        :key="index"
        class="plate-group"
      >
        <div
          v-for="n in plateCount"
          :key="n"
          :class="'plate plate-' + plateSizes[index]"
        ></div>
      </div>
    </div>
    <div class="barbell-side"></div>
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
      plateSizes: [25, 20, 15, 10, 5, 2.5, 1.25],
    };
  },
  computed: {
    plates() {
      let remainingWeight = (this.totalWeight - 45) / 2; // Subtract the weight of the bar (45 lbs) and divide by 2
      const plates = [];

      if (remainingWeight < 0) {
        return plates;
      }

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
.barbell {
  display: flex;
  align-items: center;
  padding: 20px;
}

.barbell-side {
  width: 20px;
  height: 20px;
  background-color: #333;
}

.barbell-bar {
  flex-grow: 1;
  height: 4px;
  background-color: #333;
}

.plates {
  display: flex;
  align-items: center;
}

.plate-group {
  margin: 0 4px;
}

.plate {
  width: 20px;
  height: 20px;
  margin: 0 2px;
  border-radius: 50%;
  background-color: #ccc;
}

/* Add additional styles for different plate sizes if desired */
.plate-45 {
  width: 40px;
  height: 40px;
  background-color: #4caf50;
}

.plate-35 {
  width: 35px;
  height: 35px;
  background-color: #ff9800;
}

.plate-25 {
  width: 30px;
  height: 30px;
  background-color: #f44336;
}

.plate-10 {
  width: 25px;
  height: 25px;
  background-color: #9c27b0;
}

.plate-5 {
  width: 20px;
  height: 20px;
  background-color: #2196f3;
}

.plate-2_5 {
  width: 15px;
  height: 15px;
  background-color: #009688;
}
</style>
