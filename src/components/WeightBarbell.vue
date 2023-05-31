<!-- WeightBarbell.vue -->

<template>
  <div class="barbell">
    <!-- One side of the barbell -->
    <!-- Plate group -->
    <div class="plates">
      <div
        v-for="(plate, index) in plates.slice().reverse()"
        :key="index"
        class="plate-group"
      >
        <div
          v-for="n in Array(plate.count).fill()"
          :key="n"
          :class="
            'plate plate-' +
            (this.unit === 'pounds'
              ? plate.size + '-lbs'
              : plate.size + '-kg') +
            (plate.collar ? ' collar' : '')
          "
        >
          <span class="plate-weight">{{ plate.size }}</span>
        </div>
      </div>
    </div>
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
      collarWeightKg: 2.5,
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

      if (this.unit === "kilograms" && this.totalWeight >= 25) {
        remainingWeight -= this.collarWeightKg;
        plates.push({ size: this.collarWeightKg, count: 1, collar: true }); // add collar
      }

      for (let size of plateSizes) {
        let count = 0;
        while (remainingWeight >= size) {
          count++;
          remainingWeight -= size;
        }
        if (count > 0) {
          plates.push({ size, count });
        }
      }

      return plates;
    },
  },
};
</script>

<style scoped>
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

.plate.collar {
  height: 20px;
  width: 20px;
  background-color: rgb(255, 0, 255);
}

.plate-weight {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ffffff;
  font-weight: bold;
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
