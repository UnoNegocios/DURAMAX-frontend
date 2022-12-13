<template>
    <v-container style="max-width:100vw;" class="px-6">
        <v-toolbar flat class="px-6 py-4">
            <v-toolbar-title>Metas</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu offset-y :close-on-content-click="closeDatePicker(date_filter)">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field style="max-width:320px;" class="mt-5" outlined dense clearable v-model="date_filter" label="Filtrar por Fecha" prepend-icon="mdi-calendar" v-bind="attrs" readonly v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="date_filter" range></v-date-picker>
            </v-menu>
        </v-toolbar>
        <v-row class="ma-0 pa-8 tab-border" style="background:white;">
            <v-card style="width:20%;" class="elevation-0 background-title">
                <v-list-item style="background:white;">
                </v-list-item>
                <v-list-item v-for="activity in activities" :key="activity.id">
                    <span>{{activity.type}}</span>
                </v-list-item>
                <v-list-item>
                    <span>Clientes Nuevos</span>
                </v-list-item>
                <v-list-item>
                    <span>Prospectos Nuevos</span>
                </v-list-item>
                <v-list-item>
                    <span>Cotiaziones</span>
                </v-list-item>
                <v-list-item>
                    <span>Ventas</span>
                </v-list-item>
            </v-card>
            <vue-horizontal style="width:80%;">
                <v-card style="width:15%;" v-for="user in users" :key="user.id" class="elevation-0">
                    <div class="background-title">
                        <v-list-item>
                            <span style="text-align:center; width: 100%;">{{user.name}}</span>
                        </v-list-item>
                    </div>
                    <v-list-item  v-for="activity in activities" :key="activity.id">
                        <span style="text-align:center; width: 100%;">{{activitiesCount(activity.id, user.id)}}</span>
                    </v-list-item>
                    <v-list-item>
                        <span style="text-align:center; width: 100%;">{{clientsCount(user.id)}}</span>
                    </v-list-item>
                    <v-list-item>
                        <span style="text-align:center; width: 100%;">{{leadsCount(user.id)}}</span>
                    </v-list-item>
                    <v-list-item>
                        <span style="text-align:center; width: 100%;">{{quotationsCount(user.id)}}</span>
                    </v-list-item>
                    <v-list-item>
                        <span style="text-align:center; width: 100%;">{{salesCount(user.id)}}</span>
                    </v-list-item>
                </v-card>
            </vue-horizontal>
        </v-row>
    </v-container>
</template>

<script>
import VueHorizontal from 'vue-horizontal';
export default {
    data(){return{
        date_filter:[],
    }},
    created(){
        this.$emit("closeDrawer", false);
        var date = new Date()
        this.date_filter[0] = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
        this.date_filter[1] = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
    },
    computed:{
        activities(){
            return this.$store.state.activity.activities
        },
        users(){
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
                user.name!='Inhabilitado'
            )
        }
    },
    components: {
        VueHorizontal
    },
    methods: {
        activitiesCount(activity_id, user_id){
            var response = this.$store.state.calendar.calendars.filter(calendar=>calendar.activity_id == activity_id).filter(calendar=>calendar.user_id == user_id)
            if(this.date_filter!=undefined && this.date_filter.length==2){
                response = this.filterByDate(response)
            }
            return response.length
        },
        clientsCount(user_id){
            var response = this.$store.state.company.companies.filter(company=>company.user_id == user_id)
            if(this.date_filter!=undefined && this.date_filter.length==2){
                response = this.filterByDate(response)
            }
            return response.length
        },
        leadsCount(user_id){
            var response = this.$store.state.lead.leads.filter(lead=>lead.user_id == user_id)
            if(this.date_filter!=undefined && this.date_filter.length==2){
                response = this.filterByDate(response)
            }
            return response.length
        },
        quotationsCount(user_id){
            var response = this.$store.state.quotation.quotations.filter(quotation=>quotation.status == 'quotation').filter(quotation=>quotation.user_id == user_id)
            if(this.date_filter!=undefined && this.date_filter.length==2){
                response = this.filterByDate(response)
            }
            return response.length
        },
        salesCount(user_id){
            var response = this.$store.state.quotation.quotations.filter(quotation=>quotation.status == 'vendido').filter(quotation=>quotation.user_id == user_id)
            if(this.date_filter!=undefined && this.date_filter.length==2){
                response = this.filterByDate(response)
            }
            return response.length
        },
        closeDatePicker(dates){
            if(dates!=null && dates.length==2){
                return true
            }else{
                return false
            }
        },
        filterByDate(response){
            return response.filter(resp=>new Date(resp.created_at) >= new Date(this.date_filter[0] + ' 00:00:00') && new Date(resp.created_at) <= new Date(this.date_filter[1] + ' 00:00:00'))
        }
    }
}
</script>

<style>
.fila {

}
.columna {
    width: 10%;
    display: inline-block;
}
.tab-border .v-list-item.theme--light{
    border: solid #9e9e9e!important;
    border-width: 0px 1px 1px 0px!important;
    border-radius:0px!important;
}
.background-title .v-list-item.theme--light{
    background-color: #f4f5fb;
}
.background-title .v-list-item.theme--light span{
    font-weight:500;
}

</style>