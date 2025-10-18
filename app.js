const { createApp } = Vue;

const app = createApp({
  data() {
    return { user: null };
  },
  mounted() {
    const clientId = window.APP_CONFIG?.GOOGLE_CLIENT_ID;
    if (!clientId) {
      alert("❌ GOOGLE_CLIENT_ID manquant dans config.js !");
      return;
    }

    const savedUser = localStorage.getItem("google_user");
    if (savedUser) this.user = JSON.parse(savedUser);

    google.accounts.id.initialize({
      client_id: clientId,
      callback: this.handleCredentialResponse,
      auto_select: false,
    });

    if (!this.user) {
      this.renderGoogleButton()
    }
  },
  methods: {
    handleCredentialResponse(response) {
      const data = JSON.parse(atob(response.credential.split('.')[1]));
      this.user = { name: data.name, email: data.email };
      localStorage.setItem("google_user", JSON.stringify(this.user));
    },
    logout() {
      google.accounts.id.disableAutoSelect();
      this.user = null;
      localStorage.removeItem("google_user");
      this.$nextTick(() => this.renderGoogleButton());
    },
    renderGoogleButton() {
      const signInDiv = document.getElementById("g_id_signin");
      if (signInDiv) {
        signInDiv.innerHTML = "";
        google.accounts.id.renderButton(signInDiv, {
          theme: "outline",
          size: "large",
          text: "signin",
          shape: "pill",
          logo_alignment: "center",
        }
        );
      }
    }
  },
});

app.use(PrimeVue.Config, {
  theme: { preset: PrimeVue.Themes.Aura },
});

// Composants
app.component("noro-toolbar", window.Toolbar);
app.component("noro-form", window.Form);
app.component("p-card", PrimeVue.Card);
app.component("p-toolbar", PrimeVue.Toolbar);
app.component("p-panel", PrimeVue.Panel);
app.component("p-inputgroup", PrimeVue.InputGroup);
app.component("p-inputgroupaddon", PrimeVue.InputGroupAddon);
app.component("p-inputtext", PrimeVue.InputText);
app.component("p-floatlabel", PrimeVue.FloatLabel);
app.component("p-inputnumber", PrimeVue.InputNumber);
app.component("p-select", PrimeVue.Select);
app.component("p-avatar", PrimeVue.Avatar);
app.component("p-icon", PrimeVue.Icon);
app.component("p-datepicker", PrimeVue.DatePicker);
app.component("p-button", PrimeVue.Button);

app.directive("tooltip", PrimeVue.Tooltip);

app.mount("#app");
