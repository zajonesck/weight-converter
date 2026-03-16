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
          accent: "#DC2626",
          secondary: "#1E3A5F",
          surface: "#111827",
          background: "#0A0A0A",
        },
      },
    },
  },
});

createApp(App).use(vuetify).mount("#app");
