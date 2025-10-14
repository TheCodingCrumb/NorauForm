window.Toolbar = {
  template: `
    <p-toolbar class="flex">
      <template #start>
        <img width="180px" alt="Logo norauto"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Logo_actuel_de_Norauto.png/960px-Logo_actuel_de_Norauto.png">
      </template>
      <template #center>
        <h1>Formulaire Civilité Professionnelle</h1>
      </template>
      <template #end>
        <div v-if="$root.user === null">
          <div id="g_id_signin"></div>
        </div>
        <div v-else class="connected-identity">
          <div class="connected-identity__user">
            Saisie en tant que :
            <span v-tooltip.top="$root.user.email"> {{ $root.user.name }}</span>
          </div>
          <button @click="$root.logout">
            Déconnexion
          </button>
        </div>
      </template>
    </p-toolbar>
  `,
};
