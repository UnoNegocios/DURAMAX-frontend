<template>
    <v-container style="max-width:100vw;">
        <!-- Filtros -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <filterCalendar v-bind:company="company" @filtersCalendar="filtersCalendar"/>
        </v-navigation-drawer>
        <v-card v-if="renderComponent" class="elevation-0 pa-4">
            <v-toolbar flat>
                <v-toolbar-title>{{title}}</v-toolbar-title>
                <v-btn icon>
                    <v-icon @click="openFilter">mdi-filter</v-icon>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn icon>
                    <v-icon @click="exportExcel">mdi-download</v-icon>
                </v-btn>
            </v-toolbar>

            <v-row class="ma-0">
                <v-col md="2" sd="12" v-for="(activity, index) in activitiesLists" v-bind:key="index">
                    <v-card @click="detail(activity.id)" :style="'background:'+activity.color+'!important;'">
                        <v-card-subtitle class="white--text pb-2" style="font-size:16px; font-weight:700;">{{activity.type}}</v-card-subtitle>
                        <v-card-title class="white--text pt-0">
                            {{quantity(activity.id)}}
                        </v-card-title>
                    </v-card>

                    <v-dialog v-model="dialog" width="600">
                        <v-card class="pa-6">
                            <strong>Clientes ({{clients.length}})</strong>
                            <br>
                            <div v-for="(clientId, index) in clients" v-bind:key="index" v-if="clientId!=undefined">
                                <span v-if="clientId.name!=undefined">- {{clientId.name}} ({{clientId.cantidad}})</span>
                                <span v-else>- {{clientId.razon_social}} ({{clientId.cantidad}})</span>
                                <br>
                            </div>
                        </v-card>
                    </v-dialog>
                </v-col>
            </v-row>

            <apexchart type="bar" height="440" :options="optionsCalendars" :series="optionsCalendars.calendarSeries"></apexchart>

        </v-card>
    </v-container>
</template>

<script>
import axios from "axios";
import XLSX from 'xlsx';
import FilterCalendar from "../activities/filter"
export default {
    props:{
        company:String
    },
    components: {
        'filterCalendar':FilterCalendar,
    }, 
    data: () => ({
        dialog:false,
        filters: false,
        calendars: '',
        renderComponent:true,
        optionsCalendars:{
            xaxis: {
                labels: {
                    show: false,
                }
            },
            colors: [],
            calendarSeries: [],
            plotOptions: {
                bar: {
                    distributed: true,
                }
            },
        },
        clients:[]
    }),
    created () {
        this.calendars = this.calendarsLists 
        this.optionsCalendars.calendarSeries = [this.calendarsByTypes]
        this.optionsCalendars.colors = this.colorsTypes 
        this.render()
    },
    computed: {
        title(){
            return 'Reporte de Actividades'
        },
        calendarsLists(){
            var calendars = this.$store.state.calendar.calendars
            if(this.company!='' && this.company!=undefined && this.company!=null){
                calendars = calendars.filter(calendar=>calendar.company_id == this.company)
            }
            return calendars
        },
        activitiesLists(){
            return this.$store.state.activity.activities
        },
        /* Grafica Ventas por Vendedor */
        calendarsByTypes(){
            var calendars = this.calendars 
            .map(calendar => {
                return {
                    x: calendar.activity_id,
                    y: 1,
                }
            })
            var obj = calendars.sort(function(b,a){
                return b.x - a.x;
            });
            var holder = {};
            obj.forEach(function(d) {
                if (holder.hasOwnProperty(d.x)) {
                    holder[d.x] = holder[d.x] + d.y;
                } else {
                    holder[d.x] = d.y;
                }
            });
            var obj2 = [];
            for (var prop in holder) {
                obj2.push({ x: prop, y: holder[prop] });
            }
            var perro = obj2.map(calendario => {
                return {
                    x: this.type(calendario.x),
                    y: calendario.y,
                }
            })
            var resultado = {
                data: perro,
                name: 'Cantidad',
            }
            return resultado
        },
        colorsTypes(){
            return this.$store.state.activity.activities.map(activity=>activity.color)
        }
    },
    methods: {
        detail(id){
            const numeros = this.calendars.filter(calendar=>calendar.activity_id == id).map(calendar=>calendar.company_id);
            const unicos = [];
            for(var i = 0; i < numeros.length; i++) {
                const elemento = numeros[i];
                if (!unicos.includes(numeros[i])) {
                    unicos.push(this.client(elemento, id, elemento));
                }
            }
            this.clients = unicos
            this.dialog = true
        },
        quentityAct(id, cId){
            return this.calendars.filter(calendar=>calendar.activity_id == id && calendar.company_id == cId).length
        },
        client(id, aid, cId){
            return this.$store.state.company.companies.filter(company=>company.id == id).map(id=>{
                return{
                    name: id.name,
                    razon_social: id.razon_social,
                    cantidad: this.quentityAct(aid, cId)
                }
            })[0]
        },
        quantity(id){
            return this.calendars.filter(activity=>activity.activity_id == id).length
        },
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
            if(params.activity_id!=''&&params.activity_id!=undefined&&params.activity_id!=null){
                var uno = filterCalendar.filter(company=>company.activity_id == params.activity_id[0])
                for(var i=1; i<params.activity_id.length; i++){
                    uno=uno.concat(filterCalendar.filter(company=>company.activity_id == params.activity_id[i]))   
                }
                filterCalendar = this.removeDuplicates(uno, "id");
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
                var dateNew = new Date(new Date(params.dateFrom).setDate(new Date(params.dateFrom).getDate() + 1))
                filterCalendar=filterCalendar.filter(calendar=>new Date(calendar.date) >= dateNew)
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
            this.render()
        },
        exportExcel: function () {
            let data = XLSX.utils.json_to_sheet(this.calendars)
            const workbook = XLSX.utils.book_new()
            const filename = 'Lista de Actividades'
            XLSX.utils.book_append_sheet(workbook, data, filename)
            XLSX.writeFile(workbook, `${filename}.xlsx`)
        },
        render(){
            this.optionsCalendars.calendarSeries = [this.calendarsByTypes]
            this.optionsCalendars.colors = this.colorsTypes 
            this.renderComponent = false;
            this.$nextTick(() => {
                this.renderComponent = true;
            });
        },
        type(id) {
            if(id==null || id==undefined || id=='' || id=='null' || id=='NULL'){
                return 'No definidio'
            }else{
                return this.activitiesLists.filter(activity => activity.id == id).map(activity => activity.type)[0];
            }
        },
    }
}
</script>


