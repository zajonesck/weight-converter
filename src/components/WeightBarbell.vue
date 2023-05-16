<!-- WeightBarbell.vue -->

<template>
  <div class="barbell">
    <div class="barbell-side"></div>

    <!-- Plate group for the left side, reversed -->
    <div class="plates">
      <div
        v-for="(plateCount, index) in plates.slice().reverse()"
        :key="index"
        class="plate-group"
      >
        <div
          v-for="n in plateCount"
          :key="n"
          :class="
            'plate plate-' +
            (this.unit === 'pounds'
              ? adjustedPlateSizesLbs[plates.length - 1 - index]
              : adjustedPlateSizesKg[plates.length - 1 - index])
          "
        ></div>
      </div>
    </div>

    <div class="barbell-bar"></div>

    <!-- Plate group for the right side, original order -->
    <div class="plates">
      <div
        v-for="(plateCount, index) in plates"
        :key="index"
        class="plate-group"
      >
        <div
          v-for="n in plateCount"
          :key="n"
          :class="
            'plate plate-' +
            (this.unit === 'pounds'
              ? adjustedPlateSizesLbs[index]
              : adjustedPlateSizesKg[index])
          "
        ></div>
      </div>
    </div>

    <div class="barbell-side"></div>
  </div>
</template>

<script>
const LBS_TO_KG_RATIO = 0.453592;
const KG_TO_LBS_RATIO = 2.20462;

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
  data() {
    return {
      plateSizesKg: [25, 20, 15, 10, 5, 2.5, 1.25],
      plateSizesLbs: [45, 35, 25, 10, 5, 2.5],
    };
  },
  computed: {
    adjustedPlateSizesKg() {
      return this.plateSizesKg.map(
        (size) => size / (this.unit === "pounds" ? LBS_TO_KG_RATIO : 1)
      );
    },
    adjustedPlateSizesLbs() {
      return this.plateSizesLbs.map(
        (size) => size * (this.unit === "kilograms" ? KG_TO_LBS_RATIO : 1)
      );
    },
    plates() {
      const barWeight = this.unit === "pounds" ? 45 : 20;
      let remainingWeight = (this.totalWeight - barWeight) / 2;
      const plates = [];
      const plateSizes =
        this.unit === "pounds"
          ? this.adjustedPlateSizesLbs
          : this.adjustedPlateSizesKg;

      for (let size of plateSizes) {
        while (remainingWeight >= size) {
          plates.push(size);
          remainingWeight -= size;
        }
      }

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
  height: 25px;
  width: 25px;
  background-color: #f00;
}

.plate-1\.25 {
  height: 10px;
  width: 10px;
  background-color: #f00;
}

.barbell-bar {
  background-color: #333;
  height: 20px;
  width: 200px;
}
</style>
