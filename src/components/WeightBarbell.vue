<!-- WeightBarbell.vue -->

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
          :class="'plate plate-' + adjustedPlateSizes[index]"
        ></div>
      </div>
    </div>
    <div class="barbell-bar"></div>
    <div class="plates">
      <div
        v-for="(plateCount, index) in plates.reverse()"
        :key="index"
        class="plate-group"
      >
        <div
          v-for="n in plateCount"
          :key="n"
          :class="'plate plate-' + adjustedPlateSizes[index]"
        ></div>
      </div>
    </div>
    <div class="barbell-side"></div>
  </div>
</template>

<script>
export default {
  props: {
    totalWeight: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
  },
  computed: {
    adjustedPlateSizes() {
      return this.unit === "pounds"
        ? [45, 35, 25, 10, 5, 2.5]
        : [25, 20, 15, 10, 5, 2.5, 1.25];
    },
    plates() {
      const barWeight = this.unit === "pounds" ? 45 : 20;
      let remainingWeight = (this.totalWeight - barWeight) / 2;
      const plates = [];

      if (remainingWeight < 0) {
        return plates;
      }

      this.adjustedPlateSizes.forEach((plateSize) => {
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
  justify-content: center;
  margin-top: 2rem;
}

.barbell-side {
  background-color: #333;
  height: 60px;
  width: 30px;
}

.plates {
  display: flex;
}

.plate-group {
  position: relative;
  display: flex;
}

.plate {
  border: 1px solid #555;
  border-radius: 50%;
  position: relative;
  top: 0;
}

/* .plate-25 {
  height: 50px;
  width: 50px;
  background-color: #f00;
} */
/* figure out how to diff the kgs and lbs that have the same numerical value and how to make the barbell mirrir each other*/
.plate-45,
.plate-20 {
  height: 50px;
  width: 50px;
  background-color: rgb(17, 0, 255);
}

.plate-35,
.plate-15 {
  height: 40px;
  width: 40px;
  background-color: rgb(255, 238, 0);
}

.plate-25,
.plate-10 {
  height: 30px;
  width: 30px;
  background-color: rgb(0, 255, 55);
}

.plate-5,
.plate-2\.5 {
  height: 20px;
  width: 20px;
  background-color: #f00;
}

.plate-1\.25 {
  height: 15px;
  width: 15px;
  background-color: #f00;
}

.barbell-bar {
  background-color: #333;
  height: 20px;
  width: 200px;
}
</style>
