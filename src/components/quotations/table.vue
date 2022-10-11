<template>
    <v-container style="max-width:100vw;">
        <!-- Filtros -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <filterQuotations v-bind:company="company" @filtersQuotation="filtersQuotation"/>
        </v-navigation-drawer>
        <!-- Contenedor -->
        <v-data-table show-expand :headers="headers" :items="quotations" sort-by="date" class="elevation-0 px-6 py-4">
            <!-- Header -->
            <template v-slot:top>
                <v-toolbar flat >
                    <v-toolbar-title>Cotizaciones</v-toolbar-title>
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
                <v-menu bottom left v-if="permissions('editQuotation')==true || permissions('editQuotation')==true">
                    <template v-slot:activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" v-on="on">
                        <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                    </template>
                    <v-list style="font-size:13px;">
                        <v-list-item @click="editItem(item.id)"  v-show="permissions('editQuotation')">
                            <v-icon small class="mr-2">
                                mdi-pencil
                            </v-icon>
                            Editar
                        </v-list-item>
                        <v-list-item @click="deleteItem(item)"  v-show="permissions('editQuotation')">
                            <v-icon small class="mr-2">
                                mdi-delete
                            </v-icon>
                            Eliminar
                        </v-list-item>
                        <v-list-item @click="pdfGenerator(item)">
                            <v-icon small class="mr-2">
                                mdi-file
                            </v-icon>
                            Generar PDF
                        </v-list-item>
                    </v-list>
                </v-menu>
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
                No existen registros de cotiaciones aún
            </template>
            <!-- Empresa -->
            <template v-slot:[`item.company`]="{ item }">
                <v-list-item class="px-0" style="min-height:0px!important; font-size:14px;" :to="{ path: '/clients/client/'+ item.companyID}">{{item.company}}</v-list-item>
            </template>
            <!-- Detalle PC -->
            <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                    <v-row class="pa-6">
                        <v-col cols="12" sm="6" md="6">
                            <v-data-table :headers="headers2" :items="item.items" v-if="item.items!=undefined" class="elevation-0" style="background: #f7f7f7;!important" dense>
                                <template v-slot:[`item.item`]="{ item }">
                                    {{ items(item.item) }}
                                </template>
                                <template v-slot:[`item.value`]="{ item }">
                                    {{ prices(item.item).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}) }}
                                </template>
                                <template v-slot:[`item.total`]="{ item }">
                                    {{ (prices(item.item)*item.quantity).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',}) }}
                                </template>
                            </v-data-table>
                        </v-col>
                        <v-col cols="12" sm="6" md="3" class="px-6">
                            <div class="px-4 py-3" style="background-color:#ffedb3; border-radius: 0px 10px 10px 10px; min-height:120px;" >
                                <strong>Notas:</strong><br>
                                <span>{{item.note}}</span>
                            </div>
                        </v-col>
                        <v-col cols="12" sm="6" md="1">
                            <v-btn v-if="item.pdf!=undefined" v-bind:href="'https://backendduramax.unocrm.mx/files/' + item.pdf" target="_blank" text style="margin:auto; display:block;">
                                PDF:
                                <br>
                                <v-icon >mdi-file-pdf-outline</v-icon>
                            </v-btn>
                        </v-col>
                        <v-col cols="12" sm="6" md="2">
                            <!-- Boton Cerrado -->   
                            <v-btn outlined rounded color="green" class="mb-4" @click="confirmStatus(item.id, 'vendido')" style="font-size:12px; height:30px!important; margin-left: auto; margin-right: auto; display: block;">Cerrado</v-btn>
                            <!-- Boton Cancelado -->   
                            <v-btn outlined rounded color="red" class="mt-4" @click="rejection(item.id)" style="font-size:12px; height:30px!important; margin-left: auto; margin-right: auto; display: block;">Cancelado</v-btn>
                        </v-col>
                    </v-row>
                </td>
            </template>
            <!-- Monto -->
            <template v-slot:[`item.amount`]="{ item }">
                {{item.amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
            </template>
        </v-data-table>
        <!-- Crear actividad -->
        <v-dialog v-model="createDialog" max-width="900px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn bottom color="#e74919" dark fab fixed right v-bind="attrs" v-on="on">
                <v-icon color="white">  mdi-plus </v-icon>
            </v-btn> 
          </template>
          <create v-bind:company="company" @closeCreateDialogQuotation="closeCreateDialogQuotation"/>
        </v-dialog>
        <!-- Editar actividad -->
        <v-dialog v-model="editDialog" max-width="700px">
          <edit v-bind:quotation="quotation" @closeDialogEditQuotation="closeDialogEditQuotation"/>
        </v-dialog>
        <!-- Dialogo confirmación de eliminación -->
        <div class="text-center">
            <v-bottom-sheet  v-model="sheet" inset>
                <v-sheet class="text-center" height="150px">
                    <div class="pt-6">
                    ¿Seguro que deseas borrar esta cotiazión?
                    </div>
                    <v-btn class="mt-4" text color="error" @click="deleteQuotation()">
                    Eliminar
                    </v-btn>
                    <v-btn class="mt-4" text color="grey" @click="cancel()">
                    Cancelar
                    </v-btn>
                </v-sheet>
            </v-bottom-sheet>
        </div>
        <!-- Dialogo confirmación de estatus -->
        <div class="text-center">
            <v-bottom-sheet  v-model="sheet2" inset>
                <v-sheet class="text-center" height="150px">
                    <div class="pt-6">
                    ¿Seguro que deseas cambiar el estatus esta cotiazión a {{statusData}}?
                    </div>
                    <v-btn class="mt-4" text color="primary" @click="status()">
                    Si
                    </v-btn>
                    <v-btn class="mt-4" text color="grey" @click="cancel()">
                    No
                    </v-btn>
                </v-sheet>
            </v-bottom-sheet>
        </div>


        <!-- Motivo de Rechazo -->
        <v-dialog v-model="rejectionDialog" max-width="400px">
    

            <div class="px-12 py-6" style="background-color:white;">
                Motivo de Rechazo: 
                <v-autocomplete clearable v-model="rejectionId" :items="rejectionsLists" label="Motivo de Cancelación" item-text="name" item-value="id">
                    <template slot="no-data" class="pa-2">No existen motivos relacionados.</template>                      
                </v-autocomplete>
                <v-textarea v-model="rejectionData" label="Descripcion"></v-textarea>
                <v-btn color="blue darken-1" text @click="rejectionDialog=false">
                    Cancelar
                </v-btn>
                <v-btn color="blue darken-1" text @click="confirmStatus(statusId, 'cancelado')">
                    Guardar
                </v-btn>
            </div>

        </v-dialog>


    </v-container>
</template>

<script>
import axios from "axios";
import XLSX from 'xlsx';
import Filter from "../quotations/filter"
import Create from "../quotations/create"
import Edit from "../quotations/edit"
export default {
    props:{
        company:String
    },
    components: {
        'filterQuotations':Filter,
        'create':Create,
        'edit':Edit,
    }, 
    data: () => ({
        statusData:'',
        statusId:'',
        quotation:'',
        sheet2: false,
        sheet: false,
        filters: false,
        editDialog: false,
        createDialog: false,
        detailDialog:false,
        rejectionDialog:false,
        deleteId:'',
        rejectionData:'',
        rejectionId:'',
        quotations: '',
        headers2:[
            { text: 'Cantidad', value: 'quantity',},
            { text: 'Producto | Servicio', value: 'item',},
            { text: 'Valor', value: 'value',},
            { text: 'Total', value: 'total',},
        ]
    }),
    computed: {
        showCompany(){
            if(this.company == null){
                return { text: 'Empresa', value: 'company',}
            }else{
                return false
            }
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        },
        headers(){ 
            this.quotations = this.quotationsLists
            return [

            { text: '', value: 'data-table-expand' },

            this.showCompany,
            { text: 'Contacto', value: 'contact' },
            
            { text: 'Monto', value: 'amount' },

            { text: 'Responsable', value: 'salesman', sortable: false },
            { text: 'Creación', value: 'created_at' },
            { text: 'Edición', value: 'updated_at' },
            { value: 'actions', sortable: false, align: 'end', },
        ]},
        quotationsLists(){
            var quotations = this.$store.state.quotation.quotations.filter(quotation=>quotation.status == 'quotation')
            if(this.company!='' && this.company!=undefined && this.company!=null){
                quotations = quotations.filter(quotation=>quotation.company_id == this.company)
            }
            quotations = quotations.map(id=>{
                return{
                    id:id.id,
                    companyID:id.company_id,
                    company:this.companyName(id.company_id),
                    contact:this.contact(id.contact_id),
                    salesman:this.salesman(id.user_id),
                    amount:id.amount,
                    pdf:id.pdf,
                    note:id.note,
                    items:id.items,
                    created_at:id.created_at,
                    updated_at:id.updated_at,
                }
            });

            return quotations
        },
        rejectionsLists(){
            return this.$store.state.rejection.rejections;
        },
        quotationsList(){
            return this.$store.state.quotation.quotations
        }
    },
    created () {
        
        this.quotations = this.quotationsLists   
    },
    methods: {
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
        rejection(id){
            this.statusId = id
            this.rejectionDialog = true
        },
        confirmStatus(id, status){
            this.statusId = id
            this.statusData = status
            this.sheet2 = true
        },
        status(){
            var editedItem = this.quotationsList.filter(quotation=>quotation.id == this.statusId)[0]
            editedItem.status = this.statusData
            editedItem.rejection_id = this.rejectionId
            editedItem.rejection_comment = this.rejectionData
            
            axios.put("https://backendduramax.unocrm.mx/api/v1/quotation/update",Object.assign(editedItem)).then(response=>{
                this.statusId = ''
                this.statusData = ''
                this.sheet2 = false
                this.rejectionId = ''
                this.rejectionData = ''
                this.rejectionDialog = false
                this.$store.dispatch('quotation/getQuotations')
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
        lowerCase(text){
            if(text!=null&&text!=undefined&&text!=''){
                return text.toLowerCase()
            }else{
                return ' '
            }
        },
        filtersQuotation: function(params) {
            this.quotations = ''
            if(this.company!='' && this.company!=undefined && this.company!=null){
                var filterQuotation = this.$store.state.quotation.quotations.filter(quotation=>quotation.status == 'quotation').filter(quotation=>quotation.company_id == this.company)
            }else{
                var filterQuotation = this.$store.state.quotation.quotations.filter(quotation=>quotation.status == 'quotation')
            }
            if(params.company_id!=''&&params.company_id!=undefined&&params.company_id!=null){
                var cuatro = filterQuotation.filter(company=>company.company_id == params.company_id[0])
                for(var i=1; i<params.company_id.length; i++){
                    cuatro=cuatro.concat(filterQuotation.filter(company=>company.company_id == params.company_id[i]))   
                }
                filterQuotation = this.removeDuplicates(cuatro, "id");
            }
            if(params.contact_id!=''&&params.contact_id!=undefined&&params.contact_id!=null){
                var cuatro = filterQuotation.filter(company=>company.contact_id == params.contact_id[0])
                for(var i=1; i<params.contact_id.length; i++){
                    cuatro=cuatro.concat(filterQuotation.filter(company=>company.contact_id == params.contact_id[i]))   
                }
                filterQuotation = this.removeDuplicates(cuatro, "id");
            }
            if(params.user_id!=''&&params.user_id!=undefined&&params.user_id!=null){
                var cuatro = filterQuotation.filter(company=>company.user_id == params.user_id[0])
                for(var i=1; i<params.user_id.length; i++){
                    cuatro=cuatro.concat(filterQuotation.filter(company=>company.user_id == params.user_id[i]))   
                }
                filterQuotation = this.removeDuplicates(cuatro, "id");
            }
            if(params.items!=''&&params.items!=undefined&&params.items!=null){
                var cinco = filterQuotation.filter(quotation=>this.check(quotation.items, params.items[0]) == 'contain')
                for(var i=1; i<params.items.length; i++){
                    cinco=cinco.concat(filterQuotation.filter(quotation=>this.check(quotation.items, params.items[0]) == 'contain'))   
                }
                filterQuotation = this.removeDuplicates(cinco, "id");
            }
            /* text fields */
            if(params.description!=''&&params.description!=undefined&&params.description!=null){
                filterQuotation=filterQuotation.filter(quotation=>this.lowerCase(quotation.description).includes(params.description.toLowerCase()))
            }


            /* Fecha creación */
            if(params.dateCreateFrom!='' && params.dateCreateFrom!=null && params.dateCreateFrom!=undefined){
                filterQuotation=filterQuotation.filter(quotation=>new Date(quotation.created_at) > new Date(params.dateCreateFrom))
            }
            if(params.dateCreateTo!='' && params.dateCreateTo!=null && params.dateCreateTo!=undefined){
                var dateTwo = new Date(new Date(params.dateCreateTo).setDate(new Date(params.dateCreateTo).getDate() + 1))
                filterQuotation=filterQuotation.filter(quotation=>new Date(quotation.created_at) <= dateTwo)
            }

            /* Fecha actualización */
            if(params.dateUpdateFrom!='' && params.dateUpdateFrom!=null && params.dateUpdateFrom!=undefined){
                filterQuotation = filterQuotation.filter(quotation=>new Date(quotation.updated_at) > new Date(params.dateUpdateFrom))
            }
            if(params.dateUpdateTo!='' && params.dateUpdateTo!=null && params.dateUpdateTo!=undefined){
                var dateFour = new Date(new Date(params.dateUpdateTo).setDate(new Date(params.dateUpdateTo).getDate() + 1))
                filterQuotation=filterQuotation.filter(quotation=>new Date(quotation.updated_at) <= dateFour)
            }


            this.quotations = filterQuotation.map(id=>{
                return{
                    id:id.id,
                    companyID:id.company_id,
                    company:this.companyName(id.company_id),
                    contact:this.contact(id.contact_id),
                    salesman:this.salesman(id.user_id),
                    amount:id.amount,
                    pdf:id.pdf,
                    note:id.note,
                    items:id.items,
                    created_at:id.created_at,
                    updated_at:id.updated_at,
                }
            });
        },
        check(items, param){
            if(items!=undefined&&items!=''&&items!=null){
                for(var i=0; i<items.length; i++){
                    if(items[i].item == param){
                        return 'contain'
                    }
                }  
            }
        },
        closeDialogEditQuotation: function(params) {
            this.editDialog = false;
            this.$store.dispatch('quotation/getQuotations')
        },
        closeCreateDialogQuotation: function(params) {
            this.createDialog = false;
            this.$store.dispatch('quotation/getQuotations')
        },
        exportExcel: function () {
            let data = XLSX.utils.json_to_sheet(this.quotations)
            const workbook = XLSX.utils.book_new()
            const filename = 'Lista de Cotizaciones'
            XLSX.utils.book_append_sheet(workbook, data, filename)
            XLSX.writeFile(workbook, `${filename}.xlsx`)
        },
        deleteQuotation(){
            axios.delete("https://backendduramax.unocrm.mx/api/v1/quotation/delete/"+this.deleteId).then(response => {
                this.deleteId = ''
                this.sheet = false
                this.$store.dispatch('quotation/getQuotations')
            });
        },
        cancel(){
            this.deleteId = ''
            this.sheet = false
            this.sheet2 = false
        },
        deleteItem (item) {
            this.deleteId = item.id
            this.sheet = true
        },
        editItem(id){
            this.quotation = this.quotationsList.filter(quotation=>quotation.id == id)[0]
            this.editDialog = true
        },
        salesman(id){
            return this.$store.state.user.users.filter(user=>user.id == id).map(user => user.name)[0]
        },
        contact(id){
            return this.$store.state.contact.contacts.filter(contact=>contact.id == id).map(contact => contact.name + ' ' + contact.last)[0]
        },
        companyName(id){
            return this.$store.state.company.companies.filter(company=>company.id == id).map(company => company.name)[0]
        },
        items(id){
            return this.$store.state.item.items.filter(item=>item.id == id).map(item => item.name)[0]
        },
        prices(id){
            return this.$store.state.item.items.filter(item=>item.id == id).map(item => item.price)[0]
        },
        pdfGenerator(item){
            localStorage.setItem('print', JSON.stringify(item));
            window.open("/");
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
    .v-data-table > .v-data-table__wrapper tbody tr.v-data-table__expanded__content {
        box-shadow: none!important;
        background: #f7f7f7;
    }
</style>