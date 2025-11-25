const { defineComponent } = Vue;

export const Notice = defineComponent({
  name: "Notice",
  template: `
    <p-panel class="content-md-min">
      <template #header>
        <h2>Notice et pense bête</h2>
      </template>
      <p-message severity="info" icon="pi pi-info-circle" variant="outlined">
        Ce formulaire vous permet de collecter les informations de potentiels <b>clients pro</b> afin que Chloé puisse
        les recontacter
      </p-message>
      <div class="spacer"></div>
      <div style="display: flex; flex-direction: row; justify-content: space-evenly;">
        <div>
          <h3>
            Informations <u>indispensables</u>
          </h3>
          <ul>
            <li>Raison sociale</li>
            <li>Telephone OU email</li>
          </ul>
        </div>
        <p-divider layout="vertical"></p-divider>
        <div>
          <h3>
            Les avantages de l'offre pro
          </h3>
          <ul>
            <li>L'ouverture est gratuite</li>
            <li>Un portail dédié (regroupement de factures par ex)</li>
            <li>Interlocutrice privilégiée</li>
            <li>Tarifs et offres preférentiels</li>
            <li>Possibilité de paiement en différé si éligible</li>
          </ul>
        </div>
      </div>
      <div class="spacer"></div>
      <div>
        <p-message severity="warn" variant="outlined">
          <h4> <i class="pi pi-exclamation-triangle" style="padding-right: 0.5rem;"></i>Attention</h4>
          <ul>
            <li>Ne pas parler des 10%</li>
            <li>Ne pas garantir le paiement en différé</li>
            <li>Ne pas parler de consignes</li>
          </ul>
        </p-message>
        <div class="spacer"></div>
        <p>
          Merci beaucoup!
        </p>
      </div>
    </p-panel>
  `,
});
