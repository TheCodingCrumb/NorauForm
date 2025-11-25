import { Toolbar } from './components/Toolbar.js';
import { Form } from './components/Form.js';
import { Notice } from './components/Notice.js';

class AuthorizationStatus {
  static Visitor = new AuthorizationStatus("visitor");
  static Authorized = new AuthorizationStatus("authorized");
  static Unauthorized = new AuthorizationStatus("unauthorized");

  constructor(name) {
    this.name = name;
  }
}

const { createApp } = Vue;
const app = createApp({
  data() {
    return {
      user: null,
      loading: false,
      isAuthorized: AuthorizationStatus.Visitor,
    };
  },
  async mounted() {
    const clientId = window.APP_CONFIG?.GOOGLE_CLIENT_ID;
    if (!clientId) {
      this.$toast.add({
        severity: "error",
        summary: "Erreur",
        detail: "Un problème est survenu durant le démarrage de l'app. Contactez votre CCP.",
        life: 10000,
      });
      console.error("GOOGLE_CLIENT_ID manquant dans config.js !");
      return;
    }

    const savedUser = localStorage.getItem("google_user");
    if (savedUser) this.setUser(JSON.parse(savedUser));

    google.accounts.id.initialize({
      client_id: clientId,
      callback: await this.handleCredentialResponse,
      auto_select: false,
    });

    if (!this.user) {
      this.renderGoogleButton()
    }
  },
  methods: {
    async setUser(user) {
      this.user = user;
      if (user?.email == null) {
        this.isAuthorized = AuthorizationStatus.Visitor;
        return;
      }
      this.isAuthorized = await this.canConnect(user.email) ? AuthorizationStatus.Authorized : AuthorizationStatus.Unauthorized;
    },
    async canConnect(email) {
      const payload = {
        route: "form-authorization",
        authorEmail: email,
      };

      try {
        const scriptId = window.APP_CONFIG?.GOOGLE_SCRIPT_ID;

        if (!scriptId) {
          this.$toast.add({
            severity: "error",
            summary: "Erreur",
            detail: "Un problème est survenu durant la connexion. Contactez votre CCP.",
            life: 10000,
          });
          console.error("GOOGLE_SCRIPT_ID manquant dans config.js !");
          return;
        }

        this.loading = true;

        const response = await fetch(
          `https://script.google.com/macros/s/${scriptId}/exec`,
          {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(payload),
          }
        );

        const result = await response.json();
        if (result.code === 200) {
          return true;
        } else if (result.code === 401) {
          this.$toast.add({
            severity: "error",
            summary: "Erreur",
            detail: result.message,
            life: 5000,
          });
        }
        else {
          this.$toast.add({
            severity: "error",
            summary: "Erreur",
            detail: result.message,
            life: 5000,
          });
        }
      } catch (err) {
        this.$toast.add({
          severity: "error",
          summary: "Erreur",
          detail: err.message,
          life: 5000,
        });
      } finally {
        this.loading = false;
      }
      return false;
    },

    async handleCredentialResponse(response) {
      const data = JSON.parse(atob(response.credential.split('.')[1]));
      this.setUser(data);
      localStorage.setItem("google_user", JSON.stringify(this.user));
    },
    logout() {
      google.accounts.id.disableAutoSelect();
      this.setUser(null);
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

app.use(PrimeVue.ToastService);

// Composants
app.component("c-form", Form);
app.component("c-toolbar", Toolbar);
app.component("c-notice", Notice);

// PrimeVue Import
app.component("p-button", PrimeVue.Button);
app.component("p-divider", PrimeVue.Divider);
app.component("p-floatlabel", PrimeVue.FloatLabel);
app.component("p-icon", PrimeVue.Icon);
app.component("p-inputgroup", PrimeVue.InputGroup);
app.component("p-inputgroupaddon", PrimeVue.InputGroupAddon);
app.component("p-inputmask", PrimeVue.InputMask);
app.component("p-inputnumber", PrimeVue.InputNumber);
app.component("p-inputtext", PrimeVue.InputText);
app.component("p-message", PrimeVue.Message);
app.component("p-panel", PrimeVue.Panel);
app.component("p-progressbar", PrimeVue.ProgressBar);
app.component("p-skeleton", PrimeVue.Skeleton);
app.component("p-textarea", PrimeVue.Textarea);
app.component("p-toast", PrimeVue.Toast);
app.component("p-toolbar", PrimeVue.Toolbar);

// Directives
app.directive("tooltip", PrimeVue.Tooltip);

app.mount("#app");
