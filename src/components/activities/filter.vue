<template>
    <v-container class="ma-0 pa-0">
        <v-row class="py-10 px-8">
            <strong>Filtros</strong>

            <div class="mt-4">
                Fecha 
                <v-menu v-model="menuFrom" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                    <template v-slot:activator="{ on }">
                        <v-text-field @keydown.enter="filter()" v-model="calendar.dateFrom" label="Desde" clearable prepend-icon="mdi-calendar-today" readonly v-on="on"></v-text-field>
                    </template>
                    <v-date-picker color="primary" v-model="calendar.dateFrom" @input="menuFrom = false"></v-date-picker>
                </v-menu>
                <v-menu v-model="menuTo" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                    <template v-slot:activator="{ on }">
                        <v-text-field @keydown.enter="filter()" v-model="calendar.dateTo" label="Hasta" clearable prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                    </template>
                    <v-date-picker color="primary" v-model="calendar.dateTo" @input="menuTo = false"></v-date-picker>
                </v-menu>
            </div>

            <v-autocomplete v-if="company==undefined" @keydown.enter="filter()" v-model="calendar.company_id" :items="companyLists" item-text="name" item-value="id" attach chips label="Empresa" multiple>
                <template slot="no-data" class="pa-2">No existen empresas relacionadas.</template>  
            </v-autocomplete>

            <v-autocomplete v-if="lead==undefined" @keydown.enter="filter()" v-model="calendar.lead_id" :items="leadLists" item-text="name" item-value="id" attach chips label="Prospecto" multiple>
                <template slot="no-data" class="pa-2">No existen prospectos relacionados.</template>  
            </v-autocomplete>



            <v-autocomplete @keydown.enter="filter()" v-model="calendar.activity_id" :items="activityLists" item-text="type" item-value="id" attach chips label="Actividad" multiple>
                <template slot="no-data" class="pa-2">No existen actividades relacionadas.</template>  
            </v-autocomplete>
            <v-autocomplete @keydown.enter="filter()" v-model="calendar.user_id" :items="userLists" item-text="name" item-value="id" attach chips label="Responsable" multiple>
                <template slot="no-data" class="pa-2">No existen usuarios relacionados.</template>  
            </v-autocomplete>

            <v-text-field @keydown.enter="filter()" v-model="calendar.description" label="Descripción"></v-text-field>

        </v-row>
        <v-card style="position:absolute; bottom:0; width:100%;" tile color="primary">
            <v-list-item link @click="filter()" dark>
                <v-list-item-content>
                    <strong>Filtrar (0)</strong>
                </v-list-item-content>
            </v-list-item>    
        </v-card>
    </v-container>
</template>
<script>
  export default {
    props:{
        company:String,
        lead:String
    },
    data: () => ({
        menuTo:false,
        menuFrom:false,
        calendar:{
            company_id:null,
            contact_id:'',
            activity_id:'',
            dateFrom:'',
            dateTo:'',
            description:'',
            completed:'',
            user_id:'',
            lead_id:''
        },
    }),
    computed: {
        companyLists(){
            return this.$store.state.company.companies
        },
        leadLists(){
            return this.$store.state.lead.leads.map(id=>{
                return{
                    id:id.id,
                    name:id.name + ' (' + id.company + ')'
                }
            })
        },
        contactLists(){
            if(this.calendar.company_id!=null){
                if(this.calendar.company_id.length==0){
                    return this.$store.state.contact.contacts
                }
                else{
                    var cuatro = this.$store.state.contact.contacts.filter(contact=>contact.company_id == this.calendar.company_id[0]);
                    for(var i=1; i<this.calendar.company_id.length; i++){
                        cuatro=cuatro.concat(this.$store.state.contact.contacts.filter(contact=>contact.company_id == this.calendar.company_id[i]))   
                    }
                    return  cuatro
                }
            }
            else{
                return this.$store.state.contact.contacts
            }
        },
        activityLists(){
            return this.$store.state.activity.activities;
        },  
        userLists(){
            return this.$store.state.user.users;
        }, 
    },
    created () {
        var startDate = []
        var date = new Date()
        startDate[0] = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
        startDate[1] = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
        this.calendar.dateTo = startDate[1]
        this.calendar.dateFrom = startDate[0]
    },
    methods: {
        companyName(id){
            return this.$store.state.company.companies.filter(company=>company.id == id).map(company=>company.name)[0];
        },
        filter(){
            this.$emit("filtersCalendar", this.calendar);
        }
    }
  }
</script>