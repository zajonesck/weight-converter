<!--WeightBarbell.vue-->
<template>
  <v-container>
    <v-switch v-model="includeCollars" :label="collarLabel"></v-switch>
    <v-switch
      v-if="barWeight === 45 && unit === 'pounds'"
      v-model="use35LbPlates"
      label="35lb plates"
    ></v-switch>

    <v-card-title class="text-center headline">Plates </v-card-title>
    <v-row>
      <v-col>
        <v-card class="pa-2 d-flex justify-center align-center" outlined>
          <div class="scrollable-container">
            <div class="barbell">
              <!-- One side of the barbell -->
              <div class="plates">
                <div v-if="collarApplied" class="plate plate-collar"></div>
                <div
                  v-for="(plate, index) in plates.slice().reverse()"
                  :key="'plate-' + index"
                  class="plate-group"
                >
                  <div
                    v-for="n in Array(plate.count).fill()"
                    :key="'plate-piece-' + n"
                    :class="
                      'plate plate-' +
                      (this.unit === 'pounds'
                        ? plate.size.toString().replace('.', '-') + '-lbs'
                        : plate.size.toString().replace('.', '-') + '-kg')
                    "
                  >
                    <span class="plate-weight">{{ plate.size }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-card class="pa-2 d-flex justify-center align-center" outlined>
          <div class="plates-used">
            <ul>
              <li v-for="(plate, index) in plates" :key="index">
                {{ plate.count }} x {{ plate.size
                }}{{ this.unit === "pounds" ? " lbs" : " kg" }}
              </li>
              <li v-if="collarApplied">1 x Collar (2.5 kg)</li>
            </ul>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
    barWeight: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      plateSizesKg: [25, 20, 15, 10, 5, 2.5, 1.25],
      plateSizesLbs: [45, 35, 25, 10, 5, 2.5],
      includeCollars: false,
      use35LbPlates: true,
    };
  },
  computed: {
    collarWeight() {
      return this.unit === "pounds" ? 5 : 2.5;
    },
    collarLabel() {
      const weight = this.collarWeight;
      return `Include Collars (${weight}${
        this.unit === "pounds" ? " lbs" : " kg"
      } each)`;
    },
    collarApplied() {
      return this.includeCollars;
    },
    plates() {
      let remainingWeight = this.totalWeight - this.barWeight;
      if (this.collarApplied) {
        remainingWeight -= this.collarWeight * 2;
      }
      remainingWeight = remainingWeight / 2;
      const plates = [];
      const plateSizes =
        this.unit === "pounds" ? this.plateSizesLbs : this.plateSizesKg;

      for (let size of plateSizes) {
        // Skip 35lb plates if user has chosen not to use them and both bar and unit are set to 45lbs
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
.scrollable-container {
  overflow-x: auto;
  max-height: 300px; /* Adjust this value based on your needs */
  width: 100%;
}

.plates {
  display: flex;
  align-items: center;
  padding: 10px; /* adjust as needed */
}

.plate-group {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.plate,
.plate-collar {
  border: 1px solid #555;
  border-radius: 50%;
  position: relative;
  top: 0;
  margin: 2px;
}

.plate-collar {
  height: 20px;
  width: 20px;
  background-color: rgb(100, 100, 100);
}

.plate-collar::before {
  content: "C";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ffffff;
  font-weight: bold;
  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
}

.plate-weight {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #ffffff;
  font-weight: bold;
  text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
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

.plate-2-5-lbs {
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

.plate-2-5-kg {
  height: 20px;
  width: 20px;
  background-color: rgb(0, 0, 0);
}

.plate-1-25-kg {
  height: 20px;
  width: 20px;
  background-color: rgb(100, 100, 100);
}
</style>
