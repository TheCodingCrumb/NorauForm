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
                route: "submit-form",
                contact: this.contact,
                email: this.email,
                raison_sociale: this.raison_sociale,
                telephone: this.number,
                employeeCode: this.employeeCode,
                parkSize: this.parkSize,
                parkReferent: this.parkReferent,
                btNumber: this.btNumber,
                note: this.note,
                authorEmail: this.$root.user.email,
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
                    this.$toast.add({
                        severity: "success",
                        summary: "Succès",
                        detail: result.message,
                        life: 10000,
                    });
                    Object.keys(this.$data).forEach(k => this[k] = ""); // reset
                } else {
                    this.$toast.add({
                        severity: "error",
                        summary: "Erreur",
                        detail: result.message,
                        life: 10000,
                    });
                }
            } catch (err) {
                this.$toast.add({
                    severity: "error",
                    summary: "Erreur",
                    detail: err.message,
                    life: 10000,
                });
            }
        },
    },
    template: `
    <template v-if="$root.isAuthorized.name === 'unauthorized'">
        <p-panel class="form-blur">
            <p-message class="over-display" severity="contrast" size="large" variant="outlined">
                Vous n'avez pas l'accès à cette fonctionnalité
            </p-message>
            <p-skeleton width="10rem" class="mb-2"></p-skeleton>
            <p-skeleton width="5rem" class="mb-2"></p-skeleton>
            <p-skeleton height="2rem" class="mb-2"></p-skeleton>
            <p-skeleton width="10rem" class="mb-2"></p-skeleton>
            <p-skeleton width="5rem" class="mb-2"></p-skeleton>
            <p-skeleton height="2rem" class="mb-2"></p-skeleton>
        </p-panel>
    </template>
    <template v-else-if="$root.isAuthorized.name === 'authorized'">
        <p-panel>
            <form @submit.prevent="submitForm">
                <fieldset :disabled="$root.user === null">
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; column-gap: 10px; row-gap: 15px;">
                            <p-inputgroup>
                                <p-inputgroupaddon>
                                    <i class="material-symbols-outlined">business_center</i>
                                </p-inputgroupaddon>
                                <p-floatlabel variant="on">
                                    <p-inputtext id="raison_sociale" type="text" inputmode="text" v-model="text1"></p-inputtext>
                                    <label for="raison_sociale">Raison Sociale</label>
                                </p-floatlabel>
                            </p-inputgroup>
                        <p-inputgroup>
                            <p-inputgroupaddon>
                                <i class="material-symbols-outlined">badge</i>
                            </p-inputgroupaddon>
                            <p-floatlabel variant="on">
                                <p-inputmask id="code_vendeur" mask="99" v-model="employeeCode"></p-inputmask>
                                <label for="code_vendeur">Code Vendeur</label>
                            </p-floatlabel>
                        </p-inputgroup>
                        <p-inputgroup>
                            <p-inputgroupaddon>
                                <i class="material-symbols-outlined">assignment</i>
                            </p-inputgroupaddon>
                            <p-floatlabel variant="on">
                                <p-inputmask id="BTNumber" type="text" mask="9999" v-model="BTNumber"></p-inputmask>
                                <label for="BTNumber">BT</label>
                            </p-floatlabel>
                        </p-inputgroup>
                        <p-inputgroup>
                            <p-inputgroupaddon>
                                <i class="material-symbols-outlined">face</i>
                            </p-inputgroupaddon>
                            <p-floatlabel variant="on">
                                <p-inputtext id="contact" type="text" inputmode="text" v-model="contact"></p-inputtext>
                                <label for="contact">Interlocuteur</label>
                            </p-floatlabel>
                        </p-inputgroup>
                        <p-inputgroup>
                            <p-inputgroupaddon>
                                <i class="material-symbols-outlined">passkey</i>
                            </p-inputgroupaddon>
                            <p-floatlabel variant="on">
                                <p-inputtext id="parkReferent" type="text" v-model="parkReferent"></p-inputtext>
                                <label for="parkReferent">Gestionnaire de Parc</label>
                            </p-floatlabel>
                        </p-inputgroup>
            
                        <p-inputgroup>
                            <p-inputgroupaddon>
                                <i class="material-symbols-outlined">traffic_jam</i>
                            </p-inputgroupaddon>
                            <p-floatlabel variant="on">
                                <p-inputnumber id="parkSize" type="text" v-model="parkSize"></p-inputnumber>
                                <label for="parkSize">Taille de la flotte</label>
                            </p-floatlabel>
                        </p-inputgroup>
            
                        <div>
                            <p-inputgroup>
                                <p-inputgroupaddon>
                                    <i class="material-symbols-outlined">call</i>
                                </p-inputgroupaddon>
                                <p-floatlabel variant="on">
                                    <p-inputmask id="telephone" type="tel" mask="99 99 99 99 99 ?9999" v-model="number"></p-inputmask>
                                    <label for="telephone">Telephone</label>
                                </p-floatlabel>
                            </p-inputgroup>
                        </div>
                        <div style="grid-column-start: 2;grid-column-end: 4;">
                            <p-inputgroup>
                                <p-inputgroupaddon>
                                    <i class="material-symbols-outlined">email</i>
                                </p-inputgroupaddon>
                                <p-floatlabel variant="on">
                                    <p-inputtext id="email" type="text" inputmode="email" v-model="email"></p-inputtext>
                                    <label for="email">Email</label>
                                </p-floatlabel>
                            </p-inputgroup>
                        </div>
                        <div style="grid-column-start: 1;grid-column-end: 4;">
                            <p-inputgroup>
                                <p-inputgroupaddon>
                                    <i class="material-symbols-outlined">info</i>
                                </p-inputgroupaddon>
                                <p-floatlabel variant="on">
                                    <p-textarea id="note" type="text" v-model="note" fluid autoResize></p-textarea>
                                    <label for="note">Informations complementaires</label>
                                </p-floatlabel>
                            </p-inputgroup>
                        </div>
                    </div>
                    <div class="spacer"></div>
                    <div style="text-align: end">
                        <p-button label="Envoyer" type="submit"></p-button>
                    </div>
                </fieldset>
            </form>
        </p-panel>
    </template>
    <template v-else>
        <p-panel class="form-blur">
            <p-message class="over-display" severity="contrast" size="large" variant="outlined">
                Veuillez vous identifier avant de continuer
            </p-message>
            <p-skeleton width="10rem" class="mb-2"></p-skeleton>
            <p-skeleton width="5rem" class="mb-2"></p-skeleton>
            <p-skeleton height="2rem" class="mb-2"></p-skeleton>
            <p-skeleton width="10rem" class="mb-2"></p-skeleton>
            <p-skeleton width="5rem" class="mb-2"></p-skeleton>
            <p-skeleton height="2rem" class="mb-2"></p-skeleton>
        </p-panel>
    </template>
  `,
};
