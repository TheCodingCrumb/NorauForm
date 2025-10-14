window.Form = {
  data() {
    return {
      raison_sociale: "",
      contact: "",
      number: "",
      employeeCode: "",
      email: "",
      parkSize: "",
      parkReferent: "",
      BTNumber: "",
      note: "",
    };
  },
  methods: {
    async submitForm() {
      if (!this.$root.user) {
        alert("⚠️ Connecte-toi avec Google avant de soumettre le formulaire !");
        return;
      }

      const scriptId = window.APP_CONFIG?.GOOGLE_SCRIPT_ID;
      if (!scriptId) {
        alert("❌ GOOGLE_SCRIPT_ID manquant dans config.js !");
        return;
      }

      const payload = {
        name: this.$root.user.name,
        email: this.$root.user.email,
        raison_sociale: this.raison_sociale,
        telephone: this.number,
        code_vendeur: this.employeeCode,
        parkSize: this.parkSize,
        parkReferent: this.parkReferent,
        BTNumber: this.BTNumber,
        note: this.note,
      };

      try {
        const response = await fetch(
          `https://script.google.com/macros/s/${scriptId}/exec`,
          {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(payload),
          }
        );

        const result = await response.json();
        if (result.status === "success") {
          alert("✅ Formulaire envoyé avec succès !");
          Object.keys(this.$data).forEach(k => this[k] = ""); // reset
        } else {
          alert("❌ Erreur : " + result.message);
        }
      } catch (err) {
        alert("⚠️ Impossible d'envoyer les données : " + err.message);
      }
    },
  },
  template: `
    <p-panel header="Formulaire">
      <form @submit.prevent="submitForm">
        <p-inputgroup v-for="(field, key) in [
          { icon: 'business_center', id: 'raison_sociale', label: 'Raison Sociale', model: 'raison_sociale' },
          { icon: 'face', id: 'contact', label: 'Interlocuteur', model: 'contact' },
          { icon: 'call', id: 'telephone', label: 'Téléphone', model: 'number' },
          { icon: 'badge', id: 'code_vendeur', label: 'Code Vendeur', model: 'employeeCode' },
          { icon: 'email', id: 'email', label: 'Email', model: 'email' },
          { icon: 'traffic_jam', id: 'parkSize', label: 'Taille de la flotte', model: 'parkSize' },
          { icon: 'passkey', id: 'parkReferent', label: 'Gestionnaire de Parc', model: 'parkReferent' },
          { icon: 'assignment', id: 'BTNumber', label: 'BT', model: 'BTNumber' },
          { icon: 'info', id: 'note', label: 'Informations complémentaires', model: 'note' }
        ]" :key="key">
          <p-inputgroupaddon>
            <i class="material-symbols-outlined">{{ field.icon }}</i>
          </p-inputgroupaddon>
          <p-floatlabel variant="on">
            <p-inputtext :id="field.id" v-model="this[field.model]"></p-inputtext>
            <label :for="field.id">{{ field.label }}</label>
          </p-floatlabel>
        </p-inputgroup>

        <p-button label="Envoyer" type="submit"></p-button>
      </form>
    </p-panel>
  `,
};
