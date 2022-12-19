<template>
    <v-container style="max-width:100vw;">
        <!-- Filtros -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <filterCalendar v-bind:company="company" @filtersCalendar="filtersCalendar"/>
        </v-navigation-drawer>
        <!-- Contenedor -->
        <v-data-table :headers="headers" :items="calendars" class="elevation-0 px-6 py-4">
            <!-- Header -->
            <template v-slot:top>
                <v-toolbar flat >
                    <v-toolbar-title>Actividades</v-toolbar-title>
                    <v-btn icon>
                        <v-icon @click="openFilter">mdi-filter</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn icon>
                        <v-icon @click="exportExcel">mdi-download</v-icon>
                    </v-btn>
                </v-toolbar>
            </template>
            <!-- Acciones por fila -->
            <template v-slot:[`item.actions`]="{ item }">
                <v-menu bottom left v-if="permissions('editActivities')==true || permissions('deleteActivities')==true">
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                    </template>
                    <v-list style="font-size:13px;">
                        <v-list-item @click="editItem(item.id)" v-show="permissions('editActivities')">
                            <v-icon small class="mr-2">
                                mdi-pencil
                            </v-icon>
                            Editar
                        </v-list-item>
                        <v-list-item @click="deleteItem(item)" v-show="permissions('deleteActivities')">
                            <v-icon small class="mr-2">
                                mdi-delete
                            </v-icon>
                            Eliminar
                        </v-list-item>
                    </v-list>
                </v-menu>
            </template>
            <!-- Actividad -->
            <template v-slot:[`item.activity`]="{ item }">
                <v-chip outlined class="pa-2" small :color="color(item.activity)">{{item.activity}}</v-chip>
            </template>
            <!-- Estatus -->
            <template v-slot:[`item.completed`]="{ item }">
                <v-icon @click="status(item.id,1)" v-if="item.date<=new Date() && item.completed==0" color="red"> mdi-close </v-icon>
                <v-icon @click="status(item.id,0)" v-else-if="(item.completed==1)" color="green"> mdi-check </v-icon>
                <v-icon @click="status(item.id,1)" v-else color="primary">  mdi-calendar-clock</v-icon>
            </template >
            <!-- Creación -->
            <template v-slot:[`item.created_at`]="{ item }" style="padding:0px!important; margin:0px!important;">
                {{item.created_at.slice(0, 10)}}
            </template>
            <!-- Empresa -->
            <template v-slot:[`item.company`]="{ item }">
                <v-list-item v-if="item.company!=null" class="px-0" style="min-height:0px!important; font-size:14px;" :to="{ path: '/clients/client/'+ item.companyID}">{{item.company}}</v-list-item>
                
            </template>
            <!-- Actualización -->
            <template v-slot:[`item.updated_at`]="{ item }">
                {{item.updated_at.slice(0, 10)}}
            </template>
            <!-- Tabla sin información -->
            <template v-slot:no-data>
                No existen registros de actividades aún
            </template>
        </v-data-table>
        <!-- Crear actividad -->
        <v-dialog v-model="createDialog" max-width="900px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn bottom color="#e74919" dark fab fixed right v-bind="attrs" v-on="on">
                <v-icon color="white">  mdi-plus </v-icon>
            </v-btn> 
          </template>
          <create v-bind:company="company" @closeCreateDialogCalendar="closeCreateDialogCalendar"/>
        </v-dialog>
        <!-- Editar actividad -->
        <v-dialog v-model="editDialog" max-width="900px">
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
    </v-container>
</template>

<script>
import axios from "axios";
import XLSX from 'xlsx';
import FilterCalendar from "../activities/filter"
import Create from "../activities/create"
import Edit from "../activities/edit"
export default {
    props:{
        company:String
    },
    components: {
        'filterCalendar':FilterCalendar,
        'create':Create,
        'edit':Edit,
    }, 
    data: () => ({
        calendar:'',
        sheet: false,
        filters: false,
        editDialog: false,
        createDialog: false,
        detailDialog:false,
        deleteId:'',
        calendars: ''
    }),
    computed: {
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        },
        showCompany(){
            if(this.company == null){
                return { text: 'Empresa', value: 'company',}
            }else{
                return false
            }
        },
        showLead(){
            if(this.lead == null){
                return { text: 'Prospecto', value: 'lead',}
            }else{
                return false
            }
        },
        headers(){ 
            this.calendars = this.calendarsLists
            return [
            { text: 'Fecha', value: 'date' },
            this.showCompany,
            this.showLead,
            //{ text: 'Contacto', value: 'contact' },
            { text: 'Actividad', value: 'activity' },
            { text: 'Descripción', value: 'description' },
            //{ text: 'Estado', value: 'completed', sortable: false },
            { text: 'Responsable', value: 'salesman' },
            { text: 'Creación', value: 'created_at' },
            { text: 'Edición', value: 'updated_at' },
            { value: 'actions', sortable: false, align: 'end', },
        ]},
        calendarsLists(){
            var calendars = this.$store.state.calendar.calendars
            if(this.company!='' && this.company!=undefined && this.company!=null){
                calendars = calendars.filter(calendar=>calendar.company_id == this.company)
            }
            if(this.$route.params.type!=undefined){
                var startDate = []
                var date = new Date()
                startDate[0] = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
                startDate[1] = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
                calendars = calendars.filter(calendar=>calendar.activity_id == this.$route.params.type).filter(calendar=>calendar.date>=startDate[0] && calendar.date<=startDate[1])
                if(this.$route.params.user!=undefined){
                    calendars = calendars.filter(calendar=>calendar.user_id == this.$route.params.user)
                }
            }
            calendars = calendars.map(id=>{
                return{
                    id:id.id,
                    companyID:id.company_id,
                    company:this.companyName(id.company_id),
                    lead:this.leadName(id.lead_id),
                    contact:this.contact(id.contact_id),
                    activity:this.activity(id.activity_id),
                    salesman:this.salesman(id.user_id),
                    date:(id.date + 'perro').slice(0, 10),
                    description:id.description,
                    completed:id.completed,
                    created_at:id.created_at,
                    updated_at:id.updated_at,
                }
            });
            return calendars
        },
    },
    created () {
        
        this.calendars = this.calendarsLists   
    },
    methods: {
        lowerCase(text){
            if(text!=null&&text!=undefined&&text!=''){
                return text.toLowerCase()
            }else{
                return ' '
            }
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
        status(id, status){
            var editedItem = this.$store.state.calendar.calendars.filter(calendar=>calendar.id == id)[0]
            editedItem.completed = status
            axios.put("https://backendduramax.unocrm.mx/api/v1/calendar/update",Object.assign(editedItem)).then(response=>{
                this.$store.dispatch('calendar/getCalendars')
            })
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

            if(this.company!=''&&this.company!=undefined&&this.company!=null){
                var filterCalendar = this.$store.state.calendar.calendars.filter(log=>log.properties.attributes.company_id == this.company)
            }else{
                var filterCalendar = this.$store.state.calendar.calendars
            }

            if(this.lead!=''&&this.lead!=undefined&&this.lead!=null){
                var filterCalendar = this.$store.state.calendar.calendars.filter(log=>log.properties.attributes.lead_id == this.lead)
            }else{
                var filterCalendar = this.$store.state.calendar.calendars
            }

            if(params.company_id!=''&&params.company_id!=undefined&&params.company_id!=null){
                var cero = filterCalendar.filter(company=>company.company_id == params.company_id[0])
                for(var i=1; i<params.company_id.length; i++){
                    cero=cero.concat(filterCalendar.filter(company=>company.company_id == params.company_id[i]))   
                }
                filterCalendar = this.removeDuplicates(cero, "id");
            }

            if(params.lead_id!=''&&params.lead_id!=undefined&&params.lead_id!=null){
                var menosuno = filterCalendar.filter(company=>company.lead_id == params.lead_id[0])
                for(var i=1; i<params.lead_id.length; i++){
                    menosuno=menosuno.concat(filterCalendar.filter(company=>company.lead_id == params.lead_id[i]))   
                }
                filterCalendar = this.removeDuplicates(menosuno, "id");
            }

            
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
            this.calendars = filterCalendar.map(id=>{
                return{
                    id:id.id,
                    companyID:id.company_id,
                    company:this.companyName(id.company_id),
                    lead:this.leadName(id.lead_id),
                    contact:this.contact(id.contact_id),
                    activity:this.activity(id.activity_id),
                    salesman:this.salesman(id.user_id),
                    date:id.date,
                    description:id.description,
                    completed:id.completed,
                    created_at:id.created_at,
                    updated_at:id.updated_at,
                }
            });
        },
        closeDialogEditCalendar: function(params) {
            this.editDialog = false;
            this.$store.dispatch('calendar/getCalendars')
        },
        closeCreateDialogCalendar: function(params) {
            this.createDialog = false;
            this.$store.dispatch('calendar/getCalendars')
        },
        exportExcel: function () {
            let data = XLSX.utils.json_to_sheet(this.calendars)
            const workbook = XLSX.utils.book_new()
            const filename = 'Lista de Actividades'
            XLSX.utils.book_append_sheet(workbook, data, filename)
            XLSX.writeFile(workbook, `${filename}.xlsx`)
        },
        color(id){
            return this.$store.state.activity.activities.filter(activity=>activity.id == id).map(activity => activity.color)[0]
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
        editItem(id){
            this.calendar = this.$store.state.calendar.calendars.filter(calendar=>calendar.id == id)[0]
            this.editDialog = true
        },
        salesman(user_id){
            return this.$store.state.user.users.filter(user=>user.id == user_id).map(user => user.name)[0]
        },
        activity(id){
            return this.$store.state.activity.activities.filter(activity=>activity.id == id).map(activity => activity.type)[0]
        },
        color(type){
            return this.$store.state.activity.activities.filter(activity=>activity.type == type).map(activity => activity.color)[0]
        },
        contact(id){
            return this.$store.state.contact.contacts.filter(contact=>contact.id == id).map(contact => contact.name + ' ' + contact.last)[0]
        },
        companyName(id){
            return this.$store.state.company.companies.filter(company=>company.id == id).map(company => company.name)[0]
        },
        leadName(id){
            return this.$store.state.lead.leads.filter(lead=>lead.id == id).map(lead => lead.company)[0]
        },
    }
}
</script>


<style>
    .bordercolor{
        width: 3px;
        content: ' ';
        height: 47px;
        position: absolute;
        border-radius:5px 0px 0px 5px;
    }
    @media(min-width: 980px){
        .bordercolor{
            margin-top: -13px;
            margin-left: -19px;
        }
    }
    @media(max-width: 980px){
        .bordercolor {
            height: 360px;
            left: 9px;
        }
    }
</style>