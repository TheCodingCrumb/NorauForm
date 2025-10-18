window.Toolbar = {
  template: `
    <p-toolbar class="flex">
      <template #start>
        <img width="180px" alt="Logo norauto"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Logo_actuel_de_Norauto.png/960px-Logo_actuel_de_Norauto.png">
      </template>
      <template #center>
        <h1 class="u-nomargin">Formulaire Civilité Professionnelle</h1>
      </template>
      <template #end>
        <div v-if="$root.user === null">
          <div id="g_id_signin"></div>
        </div>
        <div v-else class="connected-identity">
          <div class="connected-identity__user">
            Saisie en tant que
            <br><b v-tooltip.top="$root.user.email"> {{ $root.user.name }}</b>
            <!-- <p-avatar :label="$root.user.name.charAt(0)" class="mr-2" size="xlarge" shape="circle"></p-avatar> -->
          </div>
          <p-button @click="$root.logout" severity="secondary" rounded>
            <template #icon>
              <i class="material-symbols-outlined">logout</i>
            </template>
          </p-button>
        </div>
      </template>
    </p-toolbar>
  `,
};
