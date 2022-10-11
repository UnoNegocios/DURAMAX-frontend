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
                    <v-toolbar-title>Ventas</v-toolbar-title>
                    <v-btn icon>
                        <v-icon @click="openFilter()">mdi-filter</v-icon>
                    </v-btn>
                    <v-spacer></v-spacer>
                    <v-btn icon>
                        <v-icon @click="exportExcel">mdi-download</v-icon>
                    </v-btn>
                </v-toolbar>
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
            <!-- Detalle -->
            <template  v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                    <v-row class="pa-6">
                        <v-col cols="12" sm="6" md="7">
                            <v-data-table :headers="headers2" :items="item.items"  v-if="item.items!=undefined" class="elevation-0" style="background: #f7f7f7;!important" dense>
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
                        <v-col cols="12" sm="6" md="4" class="px-6">
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
                    </v-row>
                </td>
            </template>
            <!-- Monto -->
            <template v-slot:[`item.amount`]="{ item }">
                {{item.amount.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
            </template>
        </v-data-table>
    </v-container>
</template>

<script>
import XLSX from 'xlsx';
import Filter from "../reports/filter"
export default {
    props:{
        company:String
    },
    components: {
        'filterQuotations':Filter,
    }, 
    data: () => ({
        filters: false,
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
        headers(){ 
            this.quotations = this.quotationsLists
            return [
            { text: '', value: 'data-table-expand' },
            this.showCompany,
            { text: 'Contacto', value: 'contact' },
            { text: 'Monto', value: 'amount' },
            { text: 'Responsable', value: 'salesman', sortable: false },
            { text: 'Cotizado', value: 'created_at' },
            { text: 'Vendido', value: 'updated_at' },
        ]},
        quotationsLists(){
            var quotations = this.$store.state.quotation.quotations.filter(quotation=>quotation.status == 'vendido')
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
            if(this.company!='' && this.company!=undefined && this.company!=null){
                var filterQuotation = this.$store.state.quotation.quotations.filter(quotation=>quotation.status == 'vendido').filter(quotation=>quotation.company_id == this.company)
            }else{
                var filterQuotation = this.$store.state.quotation.quotations.filter(quotation=>quotation.status == 'vendido')
            }
            if(params.company_id!=''&&params.company_id!=undefined&&params.company_id!=null){
                var uno = filterQuotation.filter(quotation=>quotation.company_id == params.company_id[0])
                for(var i=1; i<params.company_id.length; i++){
                    uno=uno.concat(filterQuotation.filter(quotation=>quotation.company_id == params.company_id[i]))   
                }
                filterQuotation = this.removeDuplicates(uno, "id");
            }
            if(params.contact_id!=''&&params.contact_id!=undefined&&params.contact_id!=null){
                var dos = filterQuotation.filter(quotation=>quotation.contact_id == params.contact_id[0])
                for(var i=1; i<params.contact_id.length; i++){
                    dos=dos.concat(filterQuotation.filter(quotation=>quotation.contact_id == params.contact_id[i]))   
                }
                filterQuotation = this.removeDuplicates(dos, "id");
            }
            if(params.user_id!=''&&params.user_id!=undefined&&params.user_id!=null){
                var tres = filterQuotation.filter(quotation=>quotation.user_id == params.user_id[0])
                for(var i=1; i<params.user_id.length; i++){
                    tres=tres.concat(filterQuotation.filter(quotation=>quotation.user_id == params.user_id[i]))   
                }
                filterQuotation = this.removeDuplicates(tres, "id");
            }
            if(params.items!=''&&params.items!=undefined&&params.items!=null){
                var cinco = filterQuotation.filter(quotation=>this.check(quotation.items, params.items[0]) == 'contain')
                for(var i=1; i<params.items.length; i++){
                    cinco=cinco.concat(filterQuotation.filter(quotation=>this.check(quotation.items, params.items[0]) == 'contain'))   
                }
                filterQuotation = this.removeDuplicates(cinco, "id");
            }
            /* text fields */
            if(params.note!=''){
                filterQuotation=filterQuotation.filter(quotation=>this.lowerCase(quotation.note).includes(params.note.toLowerCase()))
            }


            /* Fecha creación */
            if(params.dateCreateFrom!='' && params.dateCreateFrom!=null && params.dateCreateFrom!=undefined){
                filterQuotation=filterQuotation.filter(quotation=>new Date(quotation.updated_at) > new Date(params.dateCreateFrom))
            }
            if(params.dateCreateTo!='' && params.dateCreateTo!=null && params.dateCreateTo!=undefined){
                var dateTwo = new Date(new Date(params.dateCreateTo).setDate(new Date(params.dateCreateTo).getDate() + 1))
                filterQuotation=filterQuotation.filter(quotation=>new Date(quotation.updated_at) <= dateTwo)
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
        exportExcel: function () {
            let data = XLSX.utils.json_to_sheet(this.quotations)
            const workbook = XLSX.utils.book_new()
            const filename = 'Lista de Cotizaciones'
            XLSX.utils.book_append_sheet(workbook, data, filename)
            XLSX.writeFile(workbook, `${filename}.xlsx`)
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