<template>
    <v-container style="max-width:100vw;" v-if="render">
        <!-- Filtros -->
        <v-navigation-drawer style="top: 0px; max-height:100vh!important;" right v-model="filters" :clipped="$vuetify.breakpoint.lgAndUp" app>
            <filterCalendar @filtersCalendar="filtersCalendar"/>
        </v-navigation-drawer>
        <v-card style="background:transparent;" class="elevation-0 pa-4">
            <v-toolbar style="background:transparent;" class="mb-4 px-4" flat>
                <v-toolbar-title><strong>{{title}}</strong></v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon>
                    <v-icon @click="openFilter">mdi-filter</v-icon>
                </v-btn>
            </v-toolbar>
            <strong>Por Tipo de Actividad</strong>
            <v-row class="ma-0">
                <v-col md="2" sd="6" v-for="(activity, index) in activitiesLists" v-bind:key="index">
                    <v-card :to="{ path: '/activities/' + activity.id }">
                        <v-card-subtitle class="pb-2" style="font-size:16px; font-weight:700;"><v-icon :color="activity.color" x-small class="mr-2">mdi-circle</v-icon>{{activity.type}}</v-card-subtitle>
                        <v-card-title class="pt-0">
                            {{quantity(activity.id)}}
                        </v-card-title>
                    </v-card>
                </v-col>
            </v-row>
            <strong>Por Usuario</strong>
            <v-row class="ma-0">
                <v-col md="2" sd="6" v-for="(user, index) in usersLists" v-bind:key="index">
                    <v-card @click="detail_user_id=user.id, dialog=true">
                        <v-card-subtitle class="pb-2" style="font-size:16px; font-weight:700;"><v-icon :color="user.color" x-small class="mr-2">mdi-circle</v-icon>{{user.name}} {{user.last}}</v-card-subtitle>
                        <v-card-title class="pt-0">
                            {{quantityPerUser(user.id)}}
                        </v-card-title>
                    </v-card>
                </v-col>
            </v-row>
            <strong>Clientes con actividades registradas ({{clientsActivities.length}})</strong>
            <v-row class="ma-0">
                <v-col md="2" sd="6" v-for="(activity, index) in activitiesLists" v-bind:key="index">
                    <v-card>
                        <v-card-subtitle class="pb-2" style="font-size:16px; font-weight:700;"><v-icon :color="activity.color" x-small class="mr-2">mdi-circle</v-icon>{{activity.type}}</v-card-subtitle>
                        <v-card-title class="pt-0">
                            {{quantityCompany(activity.id)}}
                        </v-card-title>
                    </v-card>
                </v-col>
            </v-row>
            <strong>Prospectos con actividades registradas ({{leadsActivities.length}})</strong>
            <v-row class="ma-0">
                <v-col md="2" sd="6" v-for="(activity, index) in activitiesLists" v-bind:key="index">
                    <v-card>
                        <v-card-subtitle class="pb-2" style="font-size:16px; font-weight:700;"><v-icon :color="activity.color" x-small class="mr-2">mdi-circle</v-icon>{{activity.type}}</v-card-subtitle>
                        <v-card-title class="pt-0">
                            {{quantityLead(activity.id)}}
                        </v-card-title>
                    </v-card>
                </v-col>
            </v-row>
        </v-card>
        <v-dialog v-model="dialog" max-width="1080px">
          <v-card class="pa-6">
                <strong>Por Tipo de Actividad</strong>
                <v-row class="ma-0">
                    <v-col md="2" sd="6" v-for="(activity, index) in activitiesLists" v-bind:key="index">
                        <v-card :to="{ path: '/activities-type-user/' + activity.id + '/' + detail_user_id }">
                            <v-card-subtitle class="pb-2" style="font-size:16px; font-weight:700;"><v-icon :color="activity.color" x-small class="mr-2">mdi-circle</v-icon>{{activity.type}}</v-card-subtitle>
                            <v-card-title class="pt-0">
                                {{quantityPerUserAndActivityType(detail_user_id, activity.id)}}
                            </v-card-title>
                        </v-card>
                    </v-col>
                </v-row>
          </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import FilterCalendar from "../activities/filter"
export default {
    components: {
        'filterCalendar':FilterCalendar,
    }, 
    data: () => ({
        render:true,
        filters: false,
        calendars: '',
        dialog: false,
        detail_user_id:'',
        pause: false
    }),
    computed: {
        calendarsLists(){
            var startDate = []
            var date = new Date()
            startDate[0] = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
            startDate[1] = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
            return this.$store.state.calendar.calendars.filter(calendar=>
                calendar.date>=startDate[0] && calendar.date<=startDate[1])
        },
        usersLists(){
            return this.$store.state.user.users.filter(user=>
                user.name!='Administrador'&&
                user.name!='Gabriela'&&
                user.name!='Ventas'&&
                user.name!='Andrea Sanchez'&&
                user.name!='Carlos Contreras'&&
                user.name!='Alejandro Díaz'&&
                user.name!='Norbak'&&
                user.name!='Luis Gonzalez'&&
                user.name!='José Manuel'&&
                user.name!='Inhabilitado'&&
                user.name!='Araceli'&&
                user.name!='Gabriela Vazquez'&&
                user.name!='Cristina Guerra'
            )
        },
        activitiesLists(){
            return this.$store.state.activity.activities
        },
        title(){
            if(!this.pause){
                this.calendars = this.calendarsLists
            }
            return 'Actividades Registradas ' + this.calendars.length
        },
        clientsActivities(){
            let data = this.calendars.filter(calendar=>calendar.company_id!=null).map(calendar=>calendar.company_id)
            let result = data.filter((item,index)=>{
                return data.indexOf(item) === index;
            })
            return result
        },
        leadsActivities(){
            let data = this.calendars.filter(calendar=>calendar.lead_id!=null).map(calendar=>calendar.lead_id)
            let result = data.filter((item,index)=>{
                return data.indexOf(item) === index;
            })
            return result
        },
    },
    methods: {
        quantityPerUserAndActivityType(user_id, type){
            return this.calendars.filter(activity=>activity.user_id == user_id).filter(activity=>activity.activity_id == type).length
        },
        quantity(id){
            return this.calendars.filter(activity=>activity.activity_id == id).length
        },
        quantityPerUser(id){
            return this.calendars.filter(activity=>activity.user_id == id).length
        },
        quantityCompany(id){
            var data = this.calendars.filter(calendar=>calendar.company_id!=null).filter(activity=>activity.activity_id == id).map(calendar=>calendar.company_id)
            let result = data.filter((item,index)=>{
                return data.indexOf(item) === index;
            }) 
            return result.length
        },
        quantityLead(id){
            var data = this.calendars.filter(calendar=>calendar.lead_id!=null).filter(activity=>activity.activity_id == id).map(calendar=>calendar.lead_id)
            let result = data.filter((item,index)=>{
                return data.indexOf(item) === index;
            })
            return result.length
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
            this.pause = true
            this.render = false
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
            this.render = true
        },
        exportExcel: function () {
            let data = XLSX.utils.json_to_sheet(this.calendars)
            const workbook = XLSX.utils.book_new()
            const filename = 'Lista de Actividades'
            XLSX.utils.book_append_sheet(workbook, data, filename)
            XLSX.writeFile(workbook, `${filename}.xlsx`)
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