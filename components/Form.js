const { defineComponent, ref, reactive } = Vue;
import { FormElement } from './FormElement.js';

export const Form = defineComponent({
    name: "Form",
    components: { FormElement },
    setup() {
        const root = Vue.getCurrentInstance().proxy.$root;

        const form = reactive({
            raison_sociale: "",
            contact: "",
            number: "",
            employeeCode: "",
            email: "",
            parkSize: "",
            parkReferent: "",
            BTNumber: "",
            note: "",
        });

        const isSubmiting = ref(false);

        const errors = reactive({});

        const validateForm = () => {
            errors.raison_sociale = "";
            errors.number = "";
            errors.email = "";

            let valid = true;

            if (!form.raison_sociale.trim()) {
                errors.raison_sociale = "Raison sociale requise";
                valid = false;
            }

            if (!form.number.trim() && !form.email.trim()) {
                errors.number = "Téléphone ou Email requis";
                errors.email = "Téléphone ou Email requis";
                valid = false;
            }

            return valid;
        };

        const submitForm = async () => {
            if (!validateForm()) return;

            if (!root.user) {
                alert("⚠️ Connecte-toi avec Google avant de soumettre le formulaire !");
                return;
            }

            const scriptId = window.APP_CONFIG?.GOOGLE_SCRIPT_ID;
            if (!scriptId) {
                alert("❌ GOOGLE_SCRIPT_ID manquant dans config.js !");
                return;
            }

            isSubmiting.value = true;

            const payload = {
                route: "submit-form",
                contact: form.contact,
                email: form.email,
                raison_sociale: form.raison_sociale,
                telephone: form.number,
                employeeCode: form.employeeCode,
                parkSize: form.parkSize,
                parkReferent: form.parkReferent,
                btNumber: form.BTNumber,
                note: form.note,
                authorEmail: root.user.email,
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
                if (result.code === 200) {
                    root.$toast.add({
                        severity: "success",
                        summary: "Succès",
                        detail: result.message,
                        life: 10000,
                    });
                    Object.keys(form).forEach(k => form[k] = "");
                } else {
                    root.$toast.add({
                        severity: "error",
                        summary: "Erreur",
                        detail: result.message,
                        life: 10000,
                    });
                }
            } catch (err) {
                root.$toast.add({
                    severity: "error",
                    summary: "Erreur",
                    detail: err.message,
                    life: 10000,
                });
            } finally {
                isSubmiting.value = false;
            }
        };

        return { form, errors, isSubmiting, submitForm };
    },

    template: `
    <p-panel v-if="$root.isAuthorized.name === 'authorized'">
        <form @submit.prevent="submitForm">
            <fieldset :disabled="$root.user === null">
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; column-gap: 10px; row-gap: 15px; align-items: baseline;">
                    <!-- Raison Sociale -->
                    <FormElement 
                        v-model="form.raison_sociale"
                        id="raison_sociale"
                        label="Raison Sociale *"
                        icon="business_center"
                        type="text"
                        :error="errors.raison_sociale"
                    />
                    <!-- Code vendeur -->
                    <FormElement 
                        v-model="form.code_vendeur"
                        id="code_vendeur"
                        label="Code Vendeur"
                        icon="badge"
                        type="mask"
                        mask="9?9"
                    />
                    <!-- BTNumber -->
                    <FormElement 
                        v-model="form.BTNumber"
                        id="BTNumber"
                        label="BT"
                        icon="assignment"
                        type="mask"
                        mask="9?999"
                    />
                    <!-- Interlocuteur -->
                    <FormElement 
                        v-model="form.contact"
                        id="contact"
                        label="Interlocuteur"
                        icon="face"
                        type="text"
                    />
                    <!-- Gestionnaire de Parc -->
                    <FormElement 
                        v-model="form.parkReferent"
                        id="parkReferent"
                        label="Gestionnaire de Parc"
                        icon="passkey"
                        type="text"
                    />
                    <!-- Taille de la Flotte -->
                    <FormElement 
                        v-model="form.parkSize"
                        id="parkSize"
                        label="Taille de la Flotte"
                        icon="traffic_jam"
                        type="number"
                    />
                    <!-- Téléphone -->
                    <FormElement 
                        v-model="form.number"
                        id="telephone"
                        label="Téléphone"
                        icon="call"
                        type="mask"
                        mask="99 99 99 99 99 ?9999"
                        :error="errors.number"
                    />
                    <!-- Email -->
                    <div style="grid-column-start: 2; grid-column-end: 4;">
                        <FormElement 
                            v-model="form.email"
                            id="email"
                            label="Email"
                            icon="email"
                            type="text"
                            :error="errors.email"
                        />
                    </div>
                    <!-- Note -->
                    <div style="grid-column-start: 1; grid-column-end: 4;">
                        <FormElement 
                            v-model="form.note"
                            id="note"
                            label="Informations complémentaires"
                            icon="info"
                            type="textarea"
                        />
                    </div>
                </div>

                <div style="text-align: end; margin-top: 1rem;">
                    <p-button label="Envoyer" type="submit" icon="pi pi-send" :loading="isSubmiting"></p-button>
                </div>
            </fieldset>
        </form>
    </p-panel>
    <p-panel v-else class="form-blur">
        <p-message v-if="!$root.loading" class="over-display" severity="contrast" size="large" variant="outlined">
            {{ $root.isAuthorized.name === 'unauthorized' ? "Vous n'avez pas l'accès à cette fonctionnalité" : "Veuillez vous identifier avant de continuer" }}
        </p-message>
        <p-skeleton :animation="$root.loading ? '' : 'none'" width="10rem" class="mb-2"></p-skeleton>
        <p-skeleton :animation="$root.loading ? '' : 'none'" width="5rem" class="mb-2"></p-skeleton>
        <p-skeleton :animation="$root.loading ? '' : 'none'" height="2rem" class="mb-2"></p-skeleton>
        <p-skeleton :animation="$root.loading ? '' : 'none'" width="10rem" class="mb-2"></p-skeleton>
        <p-skeleton :animation="$root.loading ? '' : 'none'" width="5rem" class="mb-2"></p-skeleton>
        <p-skeleton :animation="$root.loading ? '' : 'none'" height="2rem" class="mb-2"></p-skeleton>
    </p-panel>
    `
});
