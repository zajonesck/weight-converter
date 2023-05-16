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
              ? adjustedPlateSizesLbs[plates.length - 1 - index] + '-lbs'
              : adjustedPlateSizesKg[plates.length - 1 - index] + '-kg')
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
              ? adjustedPlateSizesLbs[index] + '-lbs'
              : adjustedPlateSizesKg[index] + '-kg')
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

.plate-45-lbs {
  height: 50px;
  width: 50px;
  background-color: rgb(43, 0, 255);
}

.plate-35-lbs {
  height: 40px;
  width: 40px;
  background-color: rgb(255, 247, 0);
}

.plate-25-lbs {
  height: 30px;
  width: 30px;
  background-color: rgb(20, 255, 3);
}

.plate-10-lbs {
  height: 30px;
  width: 30px;
  background-color: rgb(255, 255, 255);
}

.plate-5-lbs {
  height: 20px;
  width: 20px;
  background-color: rgb(0, 0, 0);
}

.plate-2\.5-lbs {
  height: 20px;
  width: 20px;
  background-color: rgb(100, 100, 100);
}

/* Kilogram plates */
.plate-25-kg {
  height: 50px;
  width: 50px;
  background-color: rgb(255, 4, 4);
}

.plate-20-kg {
  height: 50px;
  width: 50px;
  background-color: rgb(43, 0, 255);
}

.plate-15-kg {
  height: 40px;
  width: 40px;
  background-color: rgb(255, 247, 0);
}

.plate-10-kg {
  height: 30px;
  width: 30px;
  background-color: rgb(20, 255, 3);
}

.plate-5-kg {
  height: 30px;
  width: 30px;
  background-color: rgb(255, 255, 255);
}

.plate-2\.5-kg {
  height: 20px;
  width: 20px;
  background-color: rgb(0, 0, 0);
}

.plate-1\.25-kg {
  height: 20px;
  width: 20px;
  background-color: rgb(100, 100, 100);
}
</style>
