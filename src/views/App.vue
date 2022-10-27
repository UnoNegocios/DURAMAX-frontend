<template>
<!--000043   fb360-->
  <v-app id="inspire">
    <!-- sidebar -->
    <v-navigation-drawer  color="#f4f5fa" v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app> <!--style="box-shadow: 0px 13px 5px 0px rgb(112 112 115 / 30%)!important;z-index: 9;"-->
      <!-- sidebar-menu -->
      <v-list class="pl-0 pr-4 pt-3 sidebar" dense> 
        <v-tooltip right open-delay="1000">
          <template v-slot:activator="{ on, attrs }">
            <v-list-item to="/" link v-bind="attrs" v-on="on">
              <v-list-item-action class="mr-3">
                <v-icon>mdi-view-dashboard</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Dashboard</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <span>Pantalla de inicio</span>
        </v-tooltip>

        <div v-show="permissions('reports')">
          <v-tooltip right open-delay="1000">
            <template v-slot:activator="{ on, attrs }">
              <v-list-item to="/reports" v-bind="attrs" v-on="on">
                <v-list-item-action class="mr-3">
                  <v-icon> mdi-chart-bar</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Reportes</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              </template>
            <span>Graficas mensuales y por día</span>
          </v-tooltip>
        </div>

        <v-divider class="ma-4"></v-divider>

        <v-tooltip right open-delay="1000">
          <template v-slot:activator="{ on, attrs }">
            <v-list-item to="/calendar" link v-bind="attrs" v-on="on">
              <v-list-item-action class="mr-3">
                <v-icon>mdi-calendar-multiple</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Calendario</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            </template>
          <span>Agenda de cotizaciónes en seguimiento</span>
        </v-tooltip>
        
        <v-tooltip right open-delay="1000">
          <template v-slot:activator="{ on, attrs }">
            <v-list-item to="/activities" link v-bind="attrs" v-on="on">
              <v-list-item-action class="mr-3">
                <v-icon>mdi-checkbox-marked-outline</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Actividades</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            </template>
          <span>Lista de seguimientos de prospectos activos</span>
        </v-tooltip>

        <div v-show="permissions('reports')">
          <v-tooltip right open-delay="1000">
            <template v-slot:activator="{ on, attrs }">
              <v-list-item to="/activity-report" link v-bind="attrs" v-on="on">
                <v-list-item-action class="mr-3">
                  <v-icon> mdi-chart-bar</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Reporte de Actividades</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              </template>
            <span>Reporte de seguimientos de prospectos activos</span>
          </v-tooltip>
        </div>

        <v-divider class="ma-4"></v-divider>

        <v-tooltip right open-delay="1000">
          <template v-slot:activator="{ on, attrs }">
            <v-list-item to="/leads" link v-bind="attrs" v-on="on">
              <v-list-item-action class="mr-3">
                <v-icon> mdi-account-switch-outline</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Prospectos</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            </template>
          <span>Lista de prospectos nuevos</span>
        </v-tooltip>

        <v-tooltip right open-delay="1000">
          <template v-slot:activator="{ on, attrs }">
            <v-list-item to="/clients" link v-bind="attrs" v-on="on">
              <v-list-item-action class="mr-3">
                <v-icon> mdi-account-multiple</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Clientes</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            </template>
          <span>Lista de empresas a las que se les ha cotizado/vendido</span>
        </v-tooltip>

        <v-divider class="ma-4"></v-divider>
        
        <v-tooltip right open-delay="1000">
          <template v-slot:activator="{ on, attrs }">
            <v-list-item v-bind="attrs" v-on="on" to="/quotations" link >
              <v-list-item-action class="mr-3">
                <v-icon>  mdi-file-outline</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Cotizaciones</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <span>Prospectos de venta</span>
        </v-tooltip>

        <v-tooltip right open-delay="1000">
          <template v-slot:activator="{ on, attrs }">
            <v-list-item to="/sales" link v-bind="attrs" v-on="on">
              <v-list-item-action class="mr-3">
                <v-icon>mdi-currency-usd</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Ventas</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            </template>
          <span>Lista de ventas cerradas</span>
        </v-tooltip>

        <v-tooltip right open-delay="1000">
          <template v-slot:activator="{ on, attrs }">
            <v-list-item to="/canceled" link v-bind="attrs" v-on="on">
              <v-list-item-action class="mr-3">
                <v-icon>m mdi-close-circle-outline</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Canceladas</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            </template>
          <span>Cotizaciones que no se cerraron por algun motivo</span>
        </v-tooltip>

        <v-divider class="ma-4"></v-divider>

        <div v-show="permissions('activityLog')">
          <v-tooltip right open-delay="1000">
            <template v-slot:activator="{ on, attrs }">
              <v-list-item to="/activity-log" link v-bind="attrs" v-on="on">
                <v-list-item-action class="mr-3">
                  <v-icon>mdi-clipboard-text</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Bitacoras</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              </template>
            <span>Registro de altas y cambios</span>
          </v-tooltip>
        </div>

      </v-list>
      <template v-slot:append>
        <div style="color:#9ca3a5; font-size: 12px;" class="pa-2">
          UNOCRM | v3.0.15 <v-icon> mdi-settings</v-icon>
        </div>
      </template>
    </v-navigation-drawer>
    <!-- header -->
    <v-app-bar class="elevation-0 px-0" :clipped-left="$vuetify.breakpoint.lgAndUp" app  color="#f4f5fa" dark><!-- box-shadow: 0px 0px 5px 0px rgb(112 112 115 / 30%)!important; -->
        <v-icon @click.stop="drawer = !drawer"  class="mr-5" color="grey"> mdi-menu</v-icon>
        <img style="height: 24px;" src="/logo.png">
        <v-spacer></v-spacer>  
        <!-- search bar -->
        <!--v-text-field label="Search here for reports analytics and help" prepend-icon="mdi-magnify" rounded light class="hidden-sm-and-down mt-6"></v-text-field-->
        <!-- home button -->
        <v-btn class="hidden-sm-and-down pa-0" icon to="/" link>
          <v-icon color="#707073">mdi-apps</v-icon>
        </v-btn>
        <!-- notification button -->
        <v-menu bottom left offset-y origin="top right" transition="scale-transition">
          <template v-slot:activator="{ attrs, on }">
            <v-btn icon class="ml-2 mr-1" min-width="0" text v-bind="attrs" v-on="on">
              <v-badge overlap color="#e25104">
                <template v-slot:badge>
                  {{notes.length}}
                </template>
                <v-icon color="#707073">mdi-bell</v-icon>
              </v-badge>
            </v-btn>
          </template>
          <!-- dropdown notification -->
          <v-list dense>
            <v-list-item-group color="primary">
              <v-list-item to="/notes" link>
                <v-list-item-action>
                  <v-icon> mdi-clipboard-text</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Notas ({{notes.length}})</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-menu>
        <!-- account button -->
        <v-menu bottom left offset-y origin="top right" transition="scale-transition">
          <template v-slot:activator="{ attrs, on }">
            <v-btn class="ml-2 mr-1" text v-bind="attrs" v-on="on">
                <v-avatar size="32px">
                  <img src="https://unocrm.mx/wp-content/uploads/2020/04/cropped-Recurso-1.png" >
                </v-avatar>
                <span class="hidden-sm-and-down" style="color:#707073; margin-left:10px; text-transform: initial; letter-spacing: 0px; font-size:16px; font-weight: 400;"> {{currentUser.name}} </span> <v-icon color="#707073">mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <!-- dropdown account -->
          <v-list dense>
            <v-list-item-group color="primary">
              <v-list-item link to="/settings">
                <v-list-item-action>
                  <v-icon> mdi-cog</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Ajustes</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item link @click="logout">
                <v-list-item-action>
                  <v-icon>mdi-power</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>Cerrar Sesión</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              
            </v-list-item-group>
          </v-list>
        </v-menu>
        <!--div v-if="drawer==true" @click.stop="drawer = !drawer" style="box-shadow: rgba(112, 112, 115, 0.3) 0px 0px 5px 0px !important; transition-duration: 0.2s; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); will-change: all; transition-property: all; position:absolute; margin-left:229px; margin-top:50vh; width:24px; background:#f4f5fa; padding:50px 0px; border-radius:0px 30px 30px 0px; left:-15px; cursor: pointer;">
          <v-icon color="#e25104"> mdi-chevron-left</v-icon>
        </div>
        <div v-else @click.stop="drawer = !drawer" style="box-shadow: rgba(112, 112, 115, 0.3) 0px 0px 5px 0px !important; transition-duration: 0.2s; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); will-change: all; transition-property: all; position:absolute; margin-top:50vh; width:24px; background:#f4f5fa; padding:50px 0px; border-radius:0px 30px 30px 0px; left:-16px; cursor: pointer;">
          <v-icon color="#e25104"> mdi-chevron-right</v-icon>
        </div-->
    </v-app-bar>
    <!-- content -->
    <v-main class="pa-0" style="background-color:#f4f5fa;">
      <v-container class="pa-0" fluid>
        <router-view @closeDrawer="closeDrawer"></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<!----------------------- Scripts ----------------------->
<script>
  export default {
    name: 'AppContainer',
    data: () => ({
      drawer: true,
      attrs: {
        class: 'mb-6',
        boilerplate: true,
        elevation: 2,
      },
    }),
    methods:{
      closeDrawer: function(params) {
        this.drawer = params;
      },
      logout(){
        this.$store.dispatch('currentUser/logoutUser')
      },
      permissions(permission){
            if(this.currentUser.id==1){
                return true
            }else if(this.currentUser.permissions!=undefined){
                if(this.currentUser.permissions.includes(permission)){
                    return true
                }else{
                    return false
                }
            }else {
                return false
            }
        },
    },
    computed:{
      notes(){
        return this.$store.state.note.notes.filter(note=>note.seen == false);
      },
      currentUser:{
        get(){
          return this.$store.state.currentUser.user;
        }
      }
    },
    created(){
      this.$store.dispatch('currentUser/getUser')
      this.$store.dispatch('note/getNotes')
      this.$store.dispatch('company/getCompanies')
      this.$store.dispatch('contact/getContacts')      
      this.$store.dispatch('calendar/getCalendars')
      this.$store.dispatch('activity/getActivities')
      this.$store.dispatch('user/getUsers')  
      this.$store.dispatch('log/getLogs')
      this.$store.dispatch('item/getItems') 
	    this.$store.dispatch('rejection/getRejections') 
      this.$store.dispatch('quotation/getQuotations')
      this.$store.dispatch('origin/getOrigins')
      this.$store.dispatch('status/getStatuses')
      this.$store.dispatch('phase/getPhases')
      this.$store.dispatch('category/getCategories')
      this.$store.dispatch('lead/getLeads')
    },
  }
</script>


<!-- Styles -->      
<style>
  .v-navigation-drawer__border{
    display:none!important;
  }
  .sidebar .v-list-item.v-list-item--link.theme--light:hover{
    background-color:#e9edf8!important; 
    border-radius: 0px 20px 20px 0px!important;
  }
  .sidebar .v-list-item.v-list-item--link.theme--light:hover i::before{
    color: #1f88fe!important;
  }
  .sidebar .v-list-item--active{
    background-color:#e9edf8!important; 
    border-radius: 0px 20px 20px 0px!important;
  }
  .sidebar .v-list-item--active i::before{
    color: #1f88fe!important;
  }
  .sidebar .theme--light.v-list-item--active:hover::before, .theme--light.v-list-item--active::before {
    opacity: 0!important;
  }
  .sidebar .theme--light.v-list-item:hover::before {
    opacity: 0;
  }
  .v-window__prev, .v-window__next {
    background: transparent!important;;
  }
  .v-carousel__controls{
    display:none!important;
  }
</style>