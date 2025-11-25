import { callGoogleScript } from '../utils/api.js';

const { defineComponent, ref, reactive } = Vue;

export const FormFields = defineComponent({
    name: "FormFields",
    props: {
        form: Object,
        errors: Object,
        isSubmiting: Boolean,
        resetKey: Number
    },
    emits: ['submit'],
    setup(props, { emit }) {
        const isValidEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        const validateForm = () => {
            props.errors.raison_sociale = "";
            props.errors.number = "";
            props.errors.email = "";

            let valid = true;

            if (!props.form.raison_sociale.trim()) {
                props.errors.raison_sociale = "Raison sociale requise";
                valid = false;
            }

            if (!props.form.number.trim() && !props.form.email.trim()) {
                props.errors.number = "Téléphone ou Email requis";
                props.errors.email = "Téléphone ou Email requis";
                valid = false;
            } else {
                if (props.form.email.trim() && !isValidEmail(props.form.email)) {
                    props.errors.email = "Format d'email invalide";
                    valid = false;
                }
                if (props.form.number.trim()) {
                    props.errors.number = "Numéro de téléphone invalide";
                    valid = false;
                }
            }

            return valid;
        };

        const handleSubmit = () => {
            if (validateForm()) {
                emit('submit');
            }
        };

        return { handleSubmit };
    },
    template: `
        <form @submit.prevent="handleSubmit">
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
                                    aria-describedby="raison_sociale_error"
                                    aria-required="true"
                                ></p-inputtext>
                                <label for="raison_sociale">Raison Sociale *</label>
                            </p-floatlabel>
                        </p-inputgroup>

                        <p-message v-if="errors.raison_sociale" severity="error" size="small" variant="simple" id="raison_sociale_error">
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
                                    aria-describedby="telephone_error"
                                ></p-inputmask>
                                <label for="telephone">Téléphone</label>
                            </p-floatlabel>
                        </p-inputgroup>

                        <p-message v-if="errors.number" severity="error" size="small" variant="simple" id="telephone_error">
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
                                        aria-describedby="email_error"
                                    ></p-inputtext>
                                    <label for="email">Email</label>
                                </p-floatlabel>
                            </p-inputgroup>

                            <p-message v-if="errors.email" severity="error" size="small" variant="simple" id="email_error">
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
    `
});