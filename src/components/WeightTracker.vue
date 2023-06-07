<template>
  <!-- This could be a form for adding a new weight entry -->
  <form @submit.prevent="addWeight">
    <input type="date" v-model="date" required />
    <input type="number" v-model="weight" required />
    <button type="submit">Add weight</button>
  </form>

  <!-- This could be a list of all weight entries for a user -->
  <ul>
    <li v-for="entry in weightEntries" :key="entry.id">
      {{ entry.date }}: {{ entry.weight }}
    </li>
  </ul>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      date: "",
      weight: "",
      weightEntries: [],
    };
  },
  methods: {
    async addWeight() {
      try {
        const response = await axios.post("http://localhost:3000/weights", {
          date: this.date,
          weight: this.weight,
          userId: 1, // replace this with actual user ID
        });

        this.weightEntries.push(response.data);
        this.date = "";
        this.weight = "";
      } catch (err) {
        console.error(err);
      }
    },
  },
  async created() {
    try {
      const response = await axios.get(`http://localhost:3000/weights/${}`); // replace 1 with actual user ID
      this.weightEntries = response.data;
    } catch (err) {
      console.error(err);
    }
  },
};
</script>

<style scoped>
/* Your CSS goes here */
</style>
