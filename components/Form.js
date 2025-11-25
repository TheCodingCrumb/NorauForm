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

        const resetKey = ref(0);

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
        <form @submit.prevent="submitForm">
            <fieldset :disabled="$root.user === null">
                <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; column-gap: 10px; row-gap: 15px; align-items: baseline;">
                    <!-- Raison Sociale -->
                    <div>
                        <p-inputgroup>
                            <p-inputgroupaddon>
                                <span class="material-symbols-outlined">business_center</span>
                            </p-inputgroupaddon>

                            <p-floatlabel variant="on">
                                <p-inputtext
                                    id="raison_sociale"
                                    type="text"
                                    v-model="form.raison_sociale"
                                    :invalid="!!errors.raison_sociale"
                                ></p-inputtext>
                                <label for="raison_sociale">Raison Sociale *</label>
                            </p-floatlabel>
                        </p-inputgroup>

                        <p-message v-if="errors.raison_sociale" severity="error" size="small" variant="simple">
                            {{ errors.raison_sociale }}
                        </p-message>
                    </div>
                    <!-- Code vendeur -->
                    <p-inputgroup>
                        <p-inputgroupaddon>
                            <span class="material-symbols-outlined">badge</span>
                        </p-inputgroupaddon>

                        <p-floatlabel variant="on">
                            <p-inputmask
                                id="code_vendeur"
                                mask="9?9"
                                v-model="form.employeeCode"
                                :autoClear="false"
                                :key="resetKey"
                            ></p-inputmask>
                            <label for="code_vendeur">Code Vendeur</label>
                        </p-floatlabel>
                    </p-inputgroup>
                    <!-- BTNumber -->
                    <p-inputgroup>
                        <p-inputgroupaddon>
                            <span class="material-symbols-outlined">assignment</span>
                        </p-inputgroupaddon>

                        <p-floatlabel variant="on">
                            <p-inputmask
                                id="BTNumber"
                                mask="9?999"
                                v-model="form.BTNumber"
                                :autoClear="false"
                                :key="resetKey"
                            ></p-inputmask>
                            <label for="BTNumber">BT</label>
                        </p-floatlabel>
                    </p-inputgroup>
                    <!-- Interlocuteur -->
                    <p-inputgroup>
                        <p-inputgroupaddon>
                            <span class="material-symbols-outlined">face</span>
                        </p-inputgroupaddon>

                        <p-floatlabel variant="on">
                            <p-inputtext
                                id="contact"
                                type="text"
                                v-model="form.contact"
                            ></p-inputtext>
                            <label for="contact">Interlocuteur</label>
                        </p-floatlabel>
                    </p-inputgroup>
                    <!-- Gestionnaire de Parc -->
                    <p-inputgroup>
                        <p-inputgroupaddon>
                            <span class="material-symbols-outlined">passkey</span>
                        </p-inputgroupaddon>

                        <p-floatlabel variant="on">
                            <p-inputtext
                                id="parkReferent"
                                type="text"
                                v-model="form.parkReferent"
                            ></p-inputtext>
                            <label for="parkReferent">Gestionnaire de Parc</label>
                        </p-floatlabel>
                    </p-inputgroup>
                    <!-- Taille de la Flotte -->
                    <p-inputgroup>
                        <p-inputgroupaddon>
                            <span class="material-symbols-outlined">traffic_jam</span>
                        </p-inputgroupaddon>

                        <p-floatlabel variant="on">
                            <p-inputnumber
                                id="parkSize"
                                v-model="form.parkSize"
                            ></p-inputnumber>
                            <label for="parkSize">Taille de la Flotte</label>
                        </p-floatlabel>
                    </p-inputgroup>
                    <!-- Téléphone -->
                    <div>
                        <p-inputgroup>
                            <p-inputgroupaddon>
                                <span class="material-symbols-outlined">call</span>
                            </p-inputgroupaddon>

                            <p-floatlabel variant="on">
                                <p-inputmask
                                    id="telephone"
                                    mask="99 99 99 99 99 ?9999"
                                    v-model="form.number"
                                    :invalid="!!errors.number"
                                    :autoClear="false"
                                    :key="resetKey"
                                ></p-inputmask>
                                <label for="telephone">Téléphone</label>
                            </p-floatlabel>
                        </p-inputgroup>

                        <p-message v-if="errors.number" severity="error" size="small" variant="simple">
                            {{ errors.number }}
                        </p-message>
                    </div>
                    <!-- Email -->
                    <div style="grid-column-start: 2; grid-column-end: 4;">
                        <div>
                            <p-inputgroup>
                                <p-inputgroupaddon>
                                    <span class="material-symbols-outlined">email</span>
                                </p-inputgroupaddon>

                                <p-floatlabel variant="on">
                                    <p-inputtext
                                        id="email"
                                        type="text"
                                        v-model="form.email"
                                        :invalid="!!errors.email"
                                    ></p-inputtext>
                                    <label for="email">Email</label>
                                </p-floatlabel>
                            </p-inputgroup>

                            <p-message v-if="errors.email" severity="error" size="small" variant="simple">
                                {{ errors.email }}
                            </p-message>
                        </div>
                    </div>
                    <!-- Note -->
                    <div style="grid-column-start: 1; grid-column-end: 4;">
                        <p-inputgroup>
                            <p-inputgroupaddon>
                                <span class="material-symbols-outlined">info</span>
                            </p-inputgroupaddon>

                            <p-floatlabel variant="on">
                                <p-textarea
                                    id="note"
                                    v-model="form.note"
                                    fluid
                                    autoResize
                                ></p-textarea>
                                <label for="note">Informations complémentaires</label>
                            </p-floatlabel>
                        </p-inputgroup>
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
