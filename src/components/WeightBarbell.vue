<!--WeightBarbell.vue-->
<template>
  <v-container class="pa-2">
    <!-- Per-side weight -->
    <div class="text-center mb-3">
      <span class="text-body-2 text-medium-emphasis">
        {{ weightPerSide }} {{ unit === "pounds" ? "lbs" : "kg" }} per side
      </span>
    </div>

    <!-- Barbell visual -->
    <v-card variant="outlined" class="mb-4">
      <div class="scrollable-container">
        <div class="barbell-visual">
          <div class="bar-sleeve hide-mobile"></div>
          <div v-if="collarApplied" class="collar hide-mobile"></div>
          <!-- Left side: smallest plates on outside, largest near bar -->
          <div class="plates-side hide-mobile">
            <template v-for="(plate, idx) in platesReversed" :key="'L-' + idx">
              <div
                v-for="n in plate.count"
                :key="'L-' + idx + '-' + n"
                :class="['plate', plateClass(plate.size)]"
              ></div>
            </template>
          </div>
          <div class="bar-center"></div>
          <!-- Right side: largest plates near bar, smallest on outside -->
          <div class="plates-side">
            <template v-for="(plate, idx) in plates" :key="'R-' + idx">
              <div
                v-for="n in plate.count"
                :key="'R-' + idx + '-' + n"
                :class="['plate', plateClass(plate.size)]"
              ></div>
            </template>
          </div>
          <div v-if="collarApplied" class="collar"></div>
          <div class="bar-sleeve"></div>
        </div>
      </div>
    </v-card>

    <!-- Plate list -->
    <v-card variant="outlined">
      <div class="px-4 pt-3 pb-1 text-caption text-medium-emphasis text-uppercase" style="letter-spacing: 0.08em">Per side</div>
      <v-list density="compact" class="py-1">
        <v-list-item v-for="(plate, index) in plates" :key="index" class="px-4">
          <template #prepend>
            <div :class="['plate-swatch', plateClass(plate.size)]"></div>
          </template>
          <v-list-item-title>
            {{ plate.count }} × {{ plate.size }}{{ unit === "pounds" ? " lbs" : " kg" }}
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="collarApplied" class="px-4">
          <template #prepend>
            <div class="plate-swatch swatch-collar"></div>
          </template>
          <v-list-item-title>
            1 × Collar ({{ collarWeight }}{{ unit === "pounds" ? " lbs" : " kg" }})
          </v-list-item-title>
        </v-list-item>
        <v-list-item v-if="plates.length === 0 && !collarApplied" class="px-4">
          <v-list-item-title class="text-medium-emphasis">No plates needed</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>

    <!-- Remainder warning -->
    <v-alert
      v-if="remainder > 0"
      type="info"
      variant="tonal"
      density="compact"
      class="mt-3"
    >
      {{ remainder }} {{ unit === "pounds" ? "lbs" : "kg" }} can't be loaded with available plates
    </v-alert>
  </v-container>
</template>

<script>
export default {
  props: {
    totalWeight: { type: Number, required: true },
    unit: { type: String, required: true },
    barWeight: { type: Number, required: true },
    includeCollars: { type: Boolean, default: false },
    use35LbPlates: { type: Boolean, default: true },
  },
  data() {
    return {
      plateSizesKg: [25, 20, 15, 10, 5, 2.5, 1.25],
      plateSizesLbs: [45, 35, 25, 10, 5, 2.5],
    };
  },
  computed: {
    collarWeight() {
      return this.unit === "pounds" ? 5 : 2.5;
    },
    collarLabel() {
      const w = this.collarWeight;
      return `Collars (${w}${this.unit === "pounds" ? " lbs" : " kg"} each)`;
    },
    collarApplied() {
      return this.includeCollars;
    },
    weightPerSide() {
      const val = Math.max(0, (this.totalWeight - this.barWeight) / 2);
      return Math.round(val * 100) / 100;
    },
    plates() {
      let remainingWeight = this.totalWeight - this.barWeight;
      if (this.collarApplied) remainingWeight -= this.collarWeight * 2;
      remainingWeight = remainingWeight / 2;
      const plates = [];
      const plateSizes =
        this.unit === "pounds" ? this.plateSizesLbs : this.plateSizesKg;

      for (let size of plateSizes) {
        if (
          size === 35 &&
          !this.use35LbPlates &&
          this.barWeight === 45 &&
          this.unit === "pounds"
        ) {
          continue;
        }
        let count = 0;
        while (remainingWeight >= size) {
          count++;
          remainingWeight -= size;
        }
        if (count > 0) plates.push({ size, count });
      }
      return plates;
    },
    platesReversed() {
      return [...this.plates].reverse();
    },
    remainder() {
      let remainingWeight = this.totalWeight - this.barWeight;
      if (this.collarApplied) remainingWeight -= this.collarWeight * 2;
      if (remainingWeight <= 0) return 0;
      remainingWeight = remainingWeight / 2;
      const plateSizes =
        this.unit === "pounds" ? this.plateSizesLbs : this.plateSizesKg;
      for (let size of plateSizes) {
        if (
          size === 35 &&
          !this.use35LbPlates &&
          this.barWeight === 45 &&
          this.unit === "pounds"
        ) continue;
        while (remainingWeight >= size) remainingWeight -= size;
      }
      const total = Math.round(remainingWeight * 2 * 1000) / 1000;
      return total > 0.005 ? total : 0;
    },
  },
  methods: {
    plateClass(size) {
      const suffix = this.unit === "pounds" ? "lbs" : "kg";
      return `plate-${size.toString().replace(".", "-")}-${suffix}`;
    },
  },
};
</script>

<style scoped>
.scrollable-container {
  overflow-x: auto;
  width: 100%;
  padding: 20px 16px;
  display: flex;
  justify-content: center;
}

.barbell-visual {
  display: flex;
  align-items: center;
  width: max-content;
}

.bar-sleeve {
  height: 22px;
  width: 52px;
  background: linear-gradient(to bottom, #d8d8d8 0%, #999 40%, #777 55%, #999 70%, #d8d8d8 100%);
  border-radius: 4px;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

.collar {
  height: 34px;
  width: 11px;
  background: linear-gradient(to right, #aaa 0%, #777 50%, #999 100%);
  border: 1px solid #444;
  border-radius: 3px;
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.4);
}

.bar-center {
  height: 14px;
  min-width: 160px;
  background: linear-gradient(to bottom, #e0e0e0 0%, #bbb 20%, #888 50%, #bbb 80%, #e0e0e0 100%);
  border-radius: 7px;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.6);
}

.plates-side {
  display: flex;
  align-items: center;
}

/* Base plate */
.plate {
  border-radius: 4px;
  margin: 0 1.5px;
  border: none;
  flex-shrink: 0;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.12), 1px 0 4px rgba(0,0,0,0.6);
}

/* Pound plates */
.plate-45-lbs  { width: 16px; height: 92px; background: linear-gradient(to right, #1a2acc 0%, #3f53f5 45%, #5060ff 55%, #3f53f5 70%, #1a2acc 100%); }
.plate-35-lbs  { width: 14px; height: 76px; background: linear-gradient(to right, #a89000 0%, #e0c000 45%, #f0d010 55%, #e0c000 70%, #a89000 100%); }
.plate-25-lbs  { width: 13px; height: 62px; background: linear-gradient(to right, #158815 0%, #28b828 45%, #30cc30 55%, #28b828 70%, #158815 100%); }
.plate-10-lbs  { width: 11px; height: 48px; background: linear-gradient(to right, #aaa 0%, #e0e0e0 45%, #f0f0f0 55%, #e0e0e0 70%, #aaa 100%); }
.plate-5-lbs   { width: 11px; height: 36px; background: linear-gradient(to right, #111 0%, #333 45%, #444 55%, #333 70%, #111 100%); }
.plate-2-5-lbs { width:  9px; height: 26px; background: linear-gradient(to right, #555 0%, #888 45%, #999 55%, #888 70%, #555 100%); }

/* Kilogram plates */
.plate-25-kg   { width: 16px; height: 92px; background: linear-gradient(to right, #a81515 0%, #dd2828 45%, #f03030 55%, #dd2828 70%, #a81515 100%); }
.plate-20-kg   { width: 15px; height: 78px; background: linear-gradient(to right, #1a2acc 0%, #3f53f5 45%, #5060ff 55%, #3f53f5 70%, #1a2acc 100%); }
.plate-15-kg   { width: 13px; height: 64px; background: linear-gradient(to right, #a89000 0%, #e0c000 45%, #f0d010 55%, #e0c000 70%, #a89000 100%); }
.plate-10-kg   { width: 12px; height: 50px; background: linear-gradient(to right, #158815 0%, #28b828 45%, #30cc30 55%, #28b828 70%, #158815 100%); }
.plate-5-kg    { width: 11px; height: 38px; background: linear-gradient(to right, #aaa 0%, #e0e0e0 45%, #f0f0f0 55%, #e0e0e0 70%, #aaa 100%); }
.plate-2-5-kg  { width: 11px; height: 28px; background: linear-gradient(to right, #111 0%, #333 45%, #444 55%, #333 70%, #111 100%); }
.plate-1-25-kg { width:  9px; height: 20px; background: linear-gradient(to right, #555 0%, #888 45%, #999 55%, #888 70%, #555 100%); }

/* Color swatches for the list */
.plate-swatch {
  width: 14px;
  height: 14px;
  border-radius: 2px;
  margin-right: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  flex-shrink: 0;
}

.swatch-collar { background: #888; }

@media (max-width: 600px) {
  .hide-mobile {
    display: none;
  }
  .bar-center {
    min-width: 60px;
  }
}
</style>
