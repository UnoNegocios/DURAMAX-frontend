<template>
  <v-app>
    <v-main>
      <print v-if="printed!=null"></print>
      <app v-else-if="perro!=null"></app>
      <login v-else></login>
    </v-main>
    <v-snackbar top :value="updateExists" color="primary" timeout="999999999" style="margin-top:-72px;" content-class="py-1"><!--updateExists-->
      <span style="font-size:16px;">Hay una actualización disponible!</span>
      <v-btn class="ml-4 elevation-0" small style="margin-top:-4px;" color="white" light @click="refreshApp">
        Actualizar
      </v-btn>
    </v-snackbar>
  </v-app>
</template>
<script>
import update from './mixins/update'
import axios from "axios"
import App from "../src/views/App"
import Login from "../src/views/Login"
import Print from "../src/components/quotations/pdf"
export default {
  mixins: [update],
  name: 'App',
  data: () => ({
    perro:localStorage.getItem("xn8(*&^%$#47b*g3f76gw3*&^fn734gf8q*&^&^&mwmeg934g8whmre7ngN&G#*!NG@*&#GF(!*#gm1n428fm1g3n84gmf*^$&(%$)e3298negmg"),
    printed: localStorage.getItem("print")
  }),
  mounted(){
    axios.get("https://backendduramax.unocrm.mx/api/v1/user/current").catch(error => {
      localStorage.removeItem("xn8(*&^%$#47b*g3f76gw3*&^fn734gf8q*&^&^&mwmeg934g8whmre7ngN&G#*!NG@*&#GF(!*#gm1n428fm1g3n84gmf*^$&(%$)e3298negmg");
      this.perro = null
    });
  },
  components:{ 
    'app':App, 
    'login':Login,
    'print':Print,
  },
};
</script>
