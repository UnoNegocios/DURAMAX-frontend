<template>
    <v-container style="max-width:100vw;">
        <!-- Filtros -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <filterClients @filtersLead="filtersLead"/>
        </v-navigation-drawer>
        <!-- Contenedor -->
        <v-data-table :headers="headers" :items="leads" sort-by="date" class="elevation-0 px-6 py-4">
            <!-- Header -->
            <template v-slot:top>
                <v-toolbar flat >
                    <v-toolbar-title>Prospectos</v-toolbar-title>
                    <v-btn icon>
                        <v-icon @click="openFilter()">mdi-filter</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn icon>
                        <v-icon @click="exportExcel">mdi-download</v-icon>
                    </v-btn>
                </v-toolbar>
            </template>
            <!-- Acciones por fila -->
            <template v-slot:[`item.actions`]="{ item }">
                <v-menu bottom left v-if="permissions('editLeads')==true || permissions('deleteLeads')==true">
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                    </template>
                    <v-list style="font-size:13px;">
                        <v-list-item @click="editItem(item)" v-show="permissions('editLeads')">
                            <v-icon small class="mr-2">
                                mdi-pencil
                            </v-icon>
                            Editar
                        </v-list-item>
                        <v-list-item @click="deleteItem(item)" v-show="permissions('editLeads')">
                            <v-icon small class="mr-2">
                                mdi-delete
                            </v-icon>
                            Eliminar
                        </v-list-item>

                    </v-list>
                </v-menu>
            </template>
            <template v-slot:[`item.semaforo`]="{ item }">
                <div :style="'backgroundColor:' + color(item) + '; position: absolute; border-radius:50%; height:8px; width:8px;'"></div>
            </template>
            <!-- ¿venta? -->
            <template v-slot:[`item.conversion`]="{ item }">
                <v-icon v-if="item.conversion!=true" @click="conversion(item.id)">mdi-check-circle-outline</v-icon>
                <v-icon v-else color="primary">mdi-check-circle</v-icon>
            </template>
            <!-- Creación -->
            <template v-slot:[`item.created_at`]="{ item }">
                {{item.created_at.slice(0, 10)}}
            </template>
            <!-- Actualización -->
            <template v-slot:[`item.updated_at`]="{ item }">
                {{item.updated_at.slice(0, 10)}}
            </template>
            <!-- Tabla sin información -->
            <template v-slot:no-data>
                No existen registros de clientes aún
            </template>
        </v-data-table>
        <!-- Crear empresa -->
        <v-dialog v-model="createDialog" max-width="700px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn bottom color="#e74919" dark fab fixed right v-bind="attrs" v-on="on">
                <v-icon color="white">  mdi-plus </v-icon>
            </v-btn> 
          </template>
          <create @closeDialogCreateLead="closeDialogCreateLead"/>
        </v-dialog>
        <!-- Editar lead -->
        <v-dialog v-model="editDialog" max-width="700px">
          <edit v-bind:editedItem="lead" @closeDialogEditLead="closeDialogEditLead"/>
        </v-dialog>
        <!-- Snackbar -->
        <div class="text-center">
            <v-bottom-sheet  v-model="sheet" inset>
                <v-sheet class="text-center" height="150px">
                    <div class="pt-6">
                    ¿Seguro que deseas borrar este prospecto?
                    </div>
                    <v-btn class="mt-4" text color="error" @click="deleteLead()">
                    Eliminar
                    </v-btn>
                    <v-btn class="mt-4" text color="grey" @click="cancel()">
                    Cancelar
                    </v-btn>
                </v-sheet>
            </v-bottom-sheet>
        </div>
        <!-- Empresa -->
        <div class="text-center">
            <v-bottom-sheet  v-model="sheet2" inset>
                <v-sheet class="text-center" height="150px">
                    <div class="pt-6">
                    ¿Seguro que deseas convertir este prospecto en cliente?
                    </div>
                    <v-btn class="mt-4" text color="primary" @click="save()" :disabled="gris" :loading="gris">
                    Si
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
import Filter from "../leads/filter"
import Create from "../leads/create"
import Edit from "../leads/edit"
export default {
    components: {
        'filterClients':Filter,
        'create':Create,
        'edit':Edit
    }, 
    data: () => ({
        gris:false,
        sheet: false,
        sheet2: false,
        filters: false,
        editDialog: false,
        createDialog: false,
        detailDialog:false,
        deleteId:'',
        leads: '',
        lead:''
    }),
    computed: {
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        },
        headers(){ 
            this.leads = this.leadsLists
            return [
                { value: 'semaforo'},
                { text: 'Fecha', value: 'date'},
                { text: 'Nombre', value: 'name'},
                { text: 'Email', value: 'email'},
                { text: 'Teléfono', value: 'phone'},
                { text: 'Región', value: 'zone'},
                { text: 'Empresa', value: 'company'},
                { text: 'Medio', value: 'origin'},
                { text: 'Asunto', value: 'subject'},
                { text: 'Asesor Comercial', value: 'salesman'},
                { text: '¿Venta Concretada?', value: 'conversion'},
                { text: 'Comentarios', value: 'comments'},
                { text: 'Creación', value: 'created_at'},
                { text: 'Actualización', value: 'updated_at'},
                { value: 'actions', sortable: false, align: 'end'},
        ]},
        leadsLists(){
            return this.$store.state.lead.leads.map(id=>{
                return{
                    id:id.id,
                    name:id.name,
                    date:id.date,
                    phone:id.phone,
                    email:id.email,
                    zone:id.zone,
                    company:id.company,
                    subject:id.subject,
                    conversion:id.conversion,
                    comments:id.comments,
                    origin:this.origin(id.origin_id),
                    salesman:this.salesman(id.user_id),
                    created_at:id.created_at,
                    updated_at:id.updated_at
                }
            });
        },
    },
    created () { 
        this.leads = this.leadsLists     
    },
    methods: {
        color(item){
            var green = this.$store.state.calendar.calendars.filter(calendar=>calendar.lead_id == item.id).filter(calendar=>new Date(calendar.date) > new Date()).length
            var yellow = this.$store.state.calendar.calendars.filter(calendar=>calendar.lead_id == item.id).filter(calendar=>new Date(calendar.date) == new Date()).length
            if(green>=1){
                return '#4CAF50'
            }
            else if(item.status=='Cancelado' || (green==0 && yellow==0)){
                return '#FF5252'
            }
            else if((yellow>=1)){
                return '#FFC107'
            }
        },
        conversion(id){
            this.lead = id
            this.sheet2 = true
        },
        save(){
            this.gris = true
            var editedLead = this.$store.state.lead.leads.filter(lead=>lead.id == this.lead)[0]
            editedLead.conversion = true
            axios.put("https://backendduramax.unocrm.mx/api/v1/lead/update",Object.assign(editedLead)).then(response=>{
                this.$store.dispatch('lead/getLeads')
                var company = {
                    user_id: this.currentUser.id,
                    origin_id: editedLead.origin_id,
                    name: editedLead.name,
                    address: editedLead.zone,
                    phone: editedLead.phone,
                    email: editedLead.email,
                }
                axios.post("https://backendduramax.unocrm.mx/api/v1/company/create",Object.assign(company)).then(response=>{
                    this.lead = ''
                    this.sheet2 = false
                    this.gris = false
                })
            })
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
        lowerCase(text){
            if(text!=null&&text!=undefined&&text!=''){
                return text.toLowerCase()
            }else{
                return ' '
            }
        },
        filtersLead: function(params) {
            this.leads = ''
            var filterCompanies = this.$store.state.lead.leads
            if(params.origins!=''&&params.origins!=undefined&&params.origins!=null){
                var uno = filterCompanies.filter(company=>company.origin_id == params.origins[0])
                for(var i=1; i<params.origins.length; i++){
                    uno=uno.concat(filterCompanies.filter(company=>company.origin_id == params.origins[i]))
                }
                filterCompanies = this.removeDuplicates(uno, "id");
            }
            if(params.users!=''&&params.users!=undefined&&params.users!=null){
                var cuatro = filterCompanies.filter(company=>company.user_id == params.users[0])
                for(var i=1; i<params.users.length; i++){
                    cuatro=cuatro.concat(filterCompanies.filter(company=>company.user_id == params.users[i]))   
                }
                filterCompanies = this.removeDuplicates(cuatro, "id");
            }
            /* text fields */
            if(params.name!=''){
                filterCompanies=filterCompanies.filter(company=>this.lowerCase(company.name).includes(this.lowerCase(params.name)))
            }
            if(params.company!=''){
                filterCompanies=filterCompanies.filter(company=>this.lowerCase(company.company).includes(this.lowerCase(params.company)))
            }
            if(params.phone!=''){
                filterCompanies=filterCompanies.filter(company=>this.lowerCase(company.phone).includes(params.phone))
            }
            if(params.email!=''){
                filterCompanies=filterCompanies.filter(company=>this.lowerCase(company.email).includes(params.email))
            }
            if(params.zone!=''){
                filterCompanies=filterCompanies.filter(company=>this.lowerCase(company.zone).includes(this.lowerCase(params.zone)))
            }
            if(params.razon_social!=''){
                filterCompanies=filterCompanies.filter(company=>this.lowerCase(company.razon_social).includes(this.lowerCase(params.razon_social)))
            }
            if(params.subject!=''){
                filterCompanies=filterCompanies.filter(company=>this.lowerCase(company.subject).includes(this.lowerCase(params.subject)))
            }
            if(params.comments!=''){
                filterCompanies=filterCompanies.filter(company=>this.lowerCase(company.comments).includes(this.lowerCase(params.comments)))
            }
            /* Fecha creación */
            if(params.date.length==2){
                filterCompanies=filterCompanies.filter(company=>new Date(company.created_at) > new Date(params.dateCreateFrom))
                
                var dateTwo = new Date(new Date(params.dateCreateTo).setDate(new Date(params.dateCreateTo).getDate() + 1))
                filterCompanies=filterCompanies.filter(company=>new Date(company.created_at) <= dateTwo)
            }
            this.leads = filterCompanies.map(id=>{
                return{
                    id:id.id,
                    name:id.name,
                    date:id.date,
                    phone:id.phone,
                    email:id.email,
                    zone:id.zone,
                    company:id.company,
                    subject:id.subject,
                    conversion:id.conversion,
                    comments:id.comments,
                    origin:this.origin(id.origin_id),
                    salesman:this.salesman(id.user_id),
                    created_at:id.created_at,
                    updated_at:id.updated_at
                }
            });
        },
        closeDialogEditLead: function(params) {
            this.editDialog = params;
            this.$store.dispatch('lead/getLeads')
        },
        closeDialogCreateLead: function(params) {
            this.createDialog = params;
            this.$store.dispatch('lead/getLeads')
        },
        exportExcel: function () {
            let data = XLSX.utils.json_to_sheet(this.leads)
            const workbook = XLSX.utils.book_new()
            const filename = 'Lista de Prospectos'
            XLSX.utils.book_append_sheet(workbook, data, filename)
            XLSX.writeFile(workbook, `${filename}.xlsx`)
        },
        origin(id){
            return this.$store.state.origin.origins.filter(origin=>origin.id == id).map(origin => origin.name)[0]
        },
        salesman(id){
            return this.$store.state.user.users.filter(user=>user.id == id).map(user => user.name)[0]
        },
        deleteLead(){
            axios.delete("https://backendduramax.unocrm.mx/api/v1/lead/delete/"+this.deleteId).then(response => {
                this.deleteId = ''
                this.sheet = false
                this.$store.dispatch('lead/getLeads')
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
            this.lead = this.$store.state.lead.leads.filter(lead=>lead.id == item.id)[0]
            this.editDialog = true
        },
    }
}
</script>