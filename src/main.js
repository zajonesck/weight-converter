import { createApp } from "vue";
import App from "./App.vue";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: "dark",
    themes: {
      dark: {
        dark: true,
        colors: {
          primary: "#DC2626",
          "primary-darken-1": "#991B1B",
          accent: "#DC2626",
          secondary: "#991B1B",
          surface: "#141414",
          "surface-variant": "#1f1f1f",
          background: "#0A0A0A",
          error: "#DC2626",
          info: "#DC2626",
        },
      },
    },
  },
});

createApp(App).use(vuetify).mount("#app");
