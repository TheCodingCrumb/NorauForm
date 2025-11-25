import { callGoogleScript } from '../utils/api.js';
import { FormFields } from './FormFields.js';

const { defineComponent, ref, reactive } = Vue;

export const Form = defineComponent({
    name: "Form",
    components: { FormFields },
    setup() {
        const store = Vue.inject('store');
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

        const resetKey = ref(0);

        const submitForm = async () => {
            if (!store.user) {
                root.$toast.add({
                    severity: "error",
                    summary: "Erreur",
                    detail: "Connectez-vous avec Google avant de soumettre le formulaire !",
                    life: 10000,
                });
                return;
            }

            isSubmiting.value = true;

            const payload = {
                contact: form.contact,
                email: form.email,
                raison_sociale: form.raison_sociale,
                telephone: form.number,
                employeeCode: form.employeeCode,
                parkSize: form.parkSize,
                parkReferent: form.parkReferent,
                btNumber: form.BTNumber,
                note: form.note,
                authorEmail: store.user.email,
            };

            try {
                const result = await callGoogleScript("submit-form", payload);
                if (result.code === 200) {
                    root.$toast.add({
                        severity: "success",
                        summary: "Succès",
                        detail: result.message,
                        life: 10000,
                    });
                    Object.keys(form).forEach(k => form[k] = "");
                    resetKey.value++;
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

        return { form, errors, isSubmiting, submitForm, resetKey };
    },

    template: `
    <p-panel v-if="$root.isAuthorized.name === 'authorized'">
        <form-fields
            :form="form"
            :errors="errors"
            :is-submiting="isSubmiting"
            :reset-key="resetKey"
            @submit="submitForm"
        ></form-fields>
    </p-panel>
    <p-panel v-else class="form-blur">
        <p-message v-if="!$root.loading" class="over-display" severity="contrast" size="large" variant="outlined">
            {{ $root.isAuthorized.name === 'unauthorized' ? "Vous n'avez pas l'accès à cette fonctionnalité" : "Veuillez vous identifier avant de continuer" }}
        </p-message>
        <div v-else class="over-display" >
            <p-message severity="contrast" size="large" variant="outlined">
                Vérification des authorisations en cours...
            </p-message>
            <div class="spacer"></div>
            <p-progressbar mode="indeterminate" style="height: 6px"></p-progressbar>
        </div>

        <p-skeleton :animation="$root.loading ? '' : 'none'" width="10rem" class="mb-2"></p-skeleton>
        <p-skeleton :animation="$root.loading ? '' : 'none'" width="5rem" class="mb-2"></p-skeleton>
        <p-skeleton :animation="$root.loading ? '' : 'none'" height="2rem" class="mb-2"></p-skeleton>
        <p-skeleton :animation="$root.loading ? '' : 'none'" width="10rem" class="mb-2"></p-skeleton>
        <p-skeleton :animation="$root.loading ? '' : 'none'" width="5rem" class="mb-2"></p-skeleton>
        <p-skeleton :animation="$root.loading ? '' : 'none'" height="2rem" class="mb-2"></p-skeleton>
    </p-panel>
    `
});
