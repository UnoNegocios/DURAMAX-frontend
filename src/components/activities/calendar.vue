<template>
  <v-row class="fill-height pb-12 pt-2 mx-1">
    <v-col>
      <!-- Header del calendario -->
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">HOY</v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>mdi-menu-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Día</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Semana</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Mes</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn icon class="ml-2">
            <v-icon @click="openFilter">mdi-filter</v-icon>
          </v-btn>
        </v-toolbar>
      </v-sheet>
      <v-sheet class="calendar" height="600">
        <!-- Calendario -->
        <v-calendar
          v-if="renderComponent"
          ref="calendar"
          v-model="focus"
          color="#ffff"
          :events="events"
          :event-color="getEventColor"
          :type="type"
          @click="updateRange"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          :event-text-color="text"
        ></v-calendar><!--@change="updateRange"-->
        <!-- Detalle del evento -->
        <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x >
          <v-card flat width="400px">
            <v-toolbar style="margin-bottom:-10px;" class="elevation-0">
              <v-icon :color="colorActivity(selectedEvent.type)" class="pr-2"> mdi-checkbox-blank</v-icon>
              <v-toolbar-title color="#3c4043" @click="open(selectedEvent.contact)">{{selectedEvent.type}}</v-toolbar-title><!-- #32241c -->
              <v-spacer></v-spacer>
              <v-menu bottom left>
                <template v-slot:activator="{ on, attrs }">
                <v-btn v-show="permissions('editActivities')" icon v-bind="attrs" v-on="on">
                  <v-icon color="#3c4043" small>mdi-dots-vertical</v-icon>
                </v-btn>
                </template>
                <v-list style="font-size:13px;">
                  <v-list-item @click="editItem(selectedEvent)">
                    <v-icon small class="mr-2">
                      mdi-pencil
                    </v-icon>
                    Editar
                  </v-list-item>
                  <v-list-item @click="deleteItem(selectedEvent)">
                    <v-icon small class="mr-2">
                      mdi-delete
                    </v-icon>
                    Eliminar
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-btn icon @click="selectedOpen=false">
                <v-icon color="#3c4043" small> mdi-close</v-icon><!-- #32241c -->
              </v-btn>
            </v-toolbar>
            <div class="pt-2 mx-4 mb-0" color="primary">
              <v-icon color="primary" class="mr-2 mb-1">mdi-calendar</v-icon><span style="font-size:15px; color: #1976d1; font-weight: 500;">{{fecha(selectedEvent.start)}}</span>
            </div>
            <div class="pb-1 mx-4 mb-2" color="primary">
              <v-icon color="primary" class="mr-2 mb-1">mdi-clock-outline</v-icon><span style="font-size:15px; color: #1976d1; font-weight: 500;">{{formatAMPM(selectedEvent.start)}}</span>
            </div>
            <v-card-text class="px-6 pt-1" style="color:#3c4043;">
              <v-list-item :to="{ path: '/clients/client/'+ selectedEvent.company}" class="pa-0"><v-icon small class="mr-2 mb-1">mdi-domain</v-icon><strong>Empresa: </strong>{{selectedEvent.name}}</v-list-item>
              <div class="py-1"></div>
              <v-icon small class="mr-2 mb-1">mdi-account</v-icon><strong>Contacto: </strong>{{selectedEvent.contact}}
              <v-divider class="my-4"></v-divider>
              <strong>Detalle: </strong>{{selectedEvent.description}}
            </v-card-text>
            <v-card-actions>
              <div style="font-size:12px;"><strong>Responsable: </strong> {{selectedEvent.user}}</div>
              <v-spacer></v-spacer>
              <v-btn @click="status(selectedEvent.id)" elevation="0" v-if="selectedEvent.completed==0 || selectedEvent.completed==null" style="text-transform:capitalize; letter-spacing:0;" class="px-5 mb-2 mr-2" color="primary">Terminar</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
    <!-- Crear actividad -->
    <v-dialog v-model="createDialog" max-width="700px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn bottom color="#e74919" dark fab fixed right v-bind="attrs" v-on="on">
            <v-icon color="white">  mdi-plus </v-icon>
        </v-btn> 
      </template>
      <create v-bind:company="newActivityClient" @closeCreateDialogCalendar="closeCreateDialogCalendar"/>
    </v-dialog>
    <!-- Editar actividad -->
    <v-dialog v-model="editDialog" max-width="700px">
      <edit v-bind:calendar="calendar" @closeDialogEditCalendar="closeDialogEditCalendar"/>
    </v-dialog>
    <!-- Dialogo confirmación -->
    <div class="text-center">
      <v-bottom-sheet  v-model="sheet" inset>
        <v-sheet class="text-center" height="150px">
          <div class="pt-6">
          ¿Seguro que deseas borrar esta actividad?
          </div>
          <v-btn class="mt-4" text color="error" @click="deleteCalendar()">
          Eliminar
          </v-btn>
          <v-btn class="mt-4" text color="grey" @click="cancel()">
          Cancelar
          </v-btn>
        </v-sheet>
      </v-bottom-sheet>
    </div>
    <!-- Dialogo nueva actividad -->
    <div class="text-center">
      <v-bottom-sheet  v-model="sheet2" inset>
        <v-sheet class="text-center" height="150px">
          <div class="pt-6">
          ¿Quieres agendar otra actividad con esta empresa?
          </div>
          <v-btn class="mt-4" text color="error" @click="newActivity()">
          Si
          </v-btn>
          <v-btn class="mt-4" text color="grey" @click="sheet2=false">
          No
          </v-btn>
        </v-sheet>
      </v-bottom-sheet>
    </div>
    <!-- Filtros -->
    <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
        <filterClients @filtersCalendar="filtersCalendar"/>
    </v-navigation-drawer>
  </v-row>
</template>
<script>
  import axios from "axios";
  import Filter from "../activities/filter"
  import Create from "../activities/create"
  import Edit from "../activities/edit"
  export default {
    components: {
      'filterClients':Filter,
      'create':Create,
      'edit':Edit,
    }, 
    data: () => ({
      newActivityClient:'',
      renderComponent:true,
      filters: false,
      sheet: false,
      sheet2: false,
      calendar:'',
      editDialog: false,
      createDialog: false,

      detalleCliente:false,
      ventas:'',
      cliente:'',

      focus: '',
      type: 'month',
      typeToLabel: {
        month: 'Mes',
        week: 'Semana',
        day: 'Día',
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
    }),
    mounted () {
      this.$refs.calendar.checkChange()
    },
    created(){
    },
    computed:{
      calendars(){
        //var date = new Date()
        //var firstDay = new Date(date.getFullYear(), date.getMonth() - 5, 1);
        //var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return this.$store.state.calendar.calendars//.filter(calendar=>new Date(calendar.only_date)>=firstDay&&new Date(calendar.only_date)<=lastDay)//.filter(id=>id.id == '2983')
      },
      currentUser:{
        get(){
          return this.$store.state.currentUser.user;
        }
      },
      updateRange () {
        const cal = []
        //.filter(id => new Date(id.created_at) >= min && new Date(id.created_at) >= max)
        for (let i = 0; i < this.calendars.length; i++) {
          cal.push({
            company: this.calendars[i].company_id,
            name: this.company(this.calendars[i].company_id),
            start: new Date(this.calendars[i].date),//.replace(/-/g, '/')
            end: new Date(this.calendars[i].date),//.replace(/-/g, '/')
            color: this.color(this.calendars[i]),//#fbd3c2
            type: this.activity(this.calendars[i].activity_id),
            timed: true,
            description:this.calendars[i].description,
            contact:this.contact(this.calendars[i].contact_id),
            id:this.calendars[i].id,
            completed:this.calendars[i].completed,
            text:this.textColor(this.calendars[i]),
            user:this.salesman(this.calendars[i].user_id)
          })
        }
        this.events = cal
        return this.events 
      },
    },
    methods: {
      noNewActivity(){
        this.sheet2 = false
        this.newActivityClient = ''
      },
      newActivity(){
        this.sheet2 = false
        this.createDialog=true
      },
      lowerCase(text){
        if(text!=null&&text!=undefined&&text!=''){
          return text.toLowerCase()
        }else{
          return ' '
        }
      },
      removeDuplicates(originalArray, prop) {
        var newArray = [];
        var lookupObject  = {};
        for(var i in originalArray) {
          lookupObject[originalArray[i][prop]] = originalArray[i];
        }
        for(i in lookupObject) {
          newArray.push(lookupObject[i]);
        }
        return newArray;
      },
      filtersCalendar: function(params) {
        this.calendars = ''

        var filterCalendar = this.$store.state.calendar.calendars
        
        if(params.activity_id!=''&&params.activity_id!=undefined&&params.activity_id!=null){
            var uno = filterCalendar.filter(company=>company.activity_id == params.activity_id[0])
            for(var i=1; i<params.activity_id.length; i++){
                uno=uno.concat(filterCalendar.filter(company=>company.activity_id == params.activity_id[i]))   
            }
            filterCalendar = this.removeDuplicates(uno, "id");
        }
        if(params.contact_id!=''&&params.contact_id!=undefined&&params.contact_id!=null){
            var tres = filterCalendar.filter(company=>company.contact_id == params.contact_id[0])
            for(var i=1; i<params.contact_id.length; i++){
                tres=tres.concat(filterCalendar.filter(company=>company.contact_id == params.contact_id[i]))   
            }
            filterCalendar = this.removeDuplicates(tres, "id");
        }
        if(params.user_id!=''&&params.user_id!=undefined&&params.user_id!=null){
            var cuatro = filterCalendar.filter(company=>company.user_id == params.user_id[0])
            for(var i=1; i<params.user_id.length; i++){
                cuatro=cuatro.concat(filterCalendar.filter(company=>company.user_id == params.user_id[i]))   
            }
            filterCalendar = this.removeDuplicates(cuatro, "id");
        }
        /* text fields */
        if(params.description!='' && params.description!=null && params.description!=undefined){
            filterCalendar=filterCalendar.filter(calendar=>this.lowerCase(calendar.description).includes(params.description.toLowerCase()))
        }
        /* Fecha */
        if(params.dateFrom!='' && params.dateFrom!=null && params.dateFrom!=undefined){
            filterCalendar=filterCalendar.filter(calendar=>new Date(calendar.date) > new Date(params.dateFrom))
        }
        if(params.dateTo!='' && params.dateTo!=null && params.dateTo!=undefined){
            var dateTwo = new Date(new Date(params.dateTo).setDate(new Date(params.dateTo).getDate() + 1))
            filterCalendar=filterCalendar.filter(calendar=>new Date(calendar.date) <= dateTwo)
        }
        if(params.company_id!=''&&params.company_id!=undefined&&params.company_id!=null){
            var dos = filterCalendar.filter(company=>company.company_id == params.company_id[0])
            for(var i=1; i<params.company_id.length; i++){
                dos=dos.concat(filterCalendar.filter(company=>company.company_id == params.company_id[i]))   
            }
            filterCalendar = this.removeDuplicates(dos, "id");
        }
        this.calendars = filterCalendar
        this.renderComponent = false;
          this.$nextTick(() => {
              this.renderComponent = true;
          });
      },
      openFilter(){
        if(this.filters == false){
          this.$emit("closeDrawer", false);
          this.filters = true
        }else{
          this.$emit("closeDrawer", true);
          this.filters = false
        }
      },
      salesman(id){
        return this.$store.state.user.users.filter(user=>user.id == id).map(user => user.name)[0]
      },
      colorActivity(type){
        return this.$store.state.activity.activities.filter(activity=>activity.type == type).map(activity => activity.color)[0]
      },
      status(id){
        var editedItem = this.$store.state.calendar.calendars.filter(calendar=>calendar.id == id)[0]
        editedItem.completed = 1
        axios.put("https://backendduramax.unocrm.mx/api/v1/calendar/update",Object.assign(editedItem)).then(response=>{
            this.sheet2 = true
            this.newActivityClient = editedItem.company_id.toString()
            this.$store.dispatch('calendar/getCalendars')
        })
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
      formatAMPM(date) {
        var hours = new Date(date).getHours();
        var minutes = new Date(date).getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
      },
      fecha(date){
        var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
        var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");
        return diasSemana[new Date(date).getDay()] + ", " + new Date(date).getDate() + " de " + meses[new Date(date).getMonth()] + " de " + new Date(date).getFullYear()
      },
      color(calendar){
        if(calendar.completed==1){
          return '#f1f1f1'
        }else{
          if(this.currentUser.permissions!=null&&this.currentUser.permissions!=undefined){
            if(this.currentUser.permissions.includes('viewActivities')){
              return this.colorByUser(calendar.user_id)
            }else{
              return this.$store.state.activity.activities.filter(activity=>activity.id == calendar.activity_id).map(activity => activity.color)[0]
            }
          }else{
            return this.$store.state.activity.activities.filter(activity=>activity.id == calendar.activity_id).map(activity => activity.color)[0]
          }
        }
      },
      text(calendar){
        return calendar.text
      },
      textColor(calendar){
        if(calendar.completed==1){
          if(this.currentUser.permissions!=null&&this.currentUser.permissions!=undefined){
            if(this.currentUser.permissions.includes('viewActivities')){
              return this.colorByUser(calendar.user_id)
            }else{
              return this.$store.state.activity.activities.filter(activity=>activity.id == calendar.activity_id).map(activity => activity.color)[0]
            }
          }else{
            return this.$store.state.activity.activities.filter(activity=>activity.id == calendar.activity_id).map(activity => activity.color)[0]
          }
        }else{
          return 'white'
        }
      },
      activity(id){
        return this.$store.state.activity.activities.filter(activity=>activity.id == id).map(activity => activity.type)[0]
      },
      contact(id){
        return this.$store.state.contact.contacts.filter(contact=>contact.id == id).map(contact => contact.name + ' ' + contact.last)[0]
      },
      company(id){
        return this.$store.state.company.companies.filter(company=>company.id == id).map(company => company.name)[0]
      },
      open(id){
        this.cliente=id 
        this.detalleCliente=true
      },
      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
          return event.color
      },
      colorByUser(id){
        return this.$store.state.user.users.filter(user=>user.id == id).map(user => user.color)[0]
      },
      setToday () {
        this.focus = ''
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => {
            this.selectedOpen = true
          }, 10)
        }
        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }
        nativeEvent.stopPropagation()
      },
      deleteCalendar(){
        axios.delete("https://backendduramax.unocrm.mx/api/v1/calendar/delete/"+this.deleteId).then(response => {
          this.deleteId = ''
          this.sheet = false
          this.$store.dispatch('calendar/getCalendars')
        });
      },
      cancel(){
        this.deleteId = ''
        this.sheet = false
      },
      deleteItem (item) {
        this.deleteId = item.id
        this.sheet = true
      },
      editItem(item){
        this.calendar = this.$store.state.calendar.calendars.filter(calendar=>calendar.id == item.id)[0]
        this.editDialog = true
      },
      closeDialogEditCalendar: function(params) {
        this.editDialog = false;
        this.$store.dispatch('calendar/getCalendars')
      },
      closeCreateDialogCalendar: function(params) {
        this.createDialog = false;
        this.$store.dispatch('calendar/getCalendars')
      },
    },
  }
</script>
<style>
  .v-menu__content {
    box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 13.33%), 0px 8px 10px 1px rgb(0 0 0 / 9.33%), 0px 3px 14px 2px rgb(0 0 0 / 8%);
  }
</style>