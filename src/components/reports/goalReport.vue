<template>
    <v-container style="max-width:100%;" class="px-6">
        <v-toolbar flat class="px-6 pb-4 pt-2">
            <v-toolbar-title class="mt-4">Metas</v-toolbar-title>
            <v-spacer></v-spacer>
            <!--v-autocomplete class="pt-5" v-model="date_filter2" :items="goals" item-text="name" item-value="dates"></v-autocomplete-->

            <v-menu offset-y :close-on-content-click="closeDatePicker(date_filter)">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field style="max-width:320px;" class="mt-5" outlined dense clearable v-model="date_filter" label="Filtrar por Fecha" prepend-icon="mdi-calendar" v-bind="attrs" readonly v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="date_filter" range></v-date-picker>
            </v-menu>

            <v-dialog v-model="dialog" width="750" >
                <!--template v-slot:activator="{ on, attrs }">
                    <v-btn class="elevation-0 ml-8" dark v-bind="attrs" v-on="on" small rounded color="primary">Crear Nueva Meta</v-btn>
                </template-->

                <v-card>
                    <v-card-title class="text-h5 lighten-2">
                    Nueva Meta
                    </v-card-title>
                    <v-row class="ma-0 pt-4 mx-6">
                        <v-col cols="6">
                            <v-text-field v-model="new_goal.name" label="Nombre"></v-text-field>
                            <!--v-text-field v-model="new_goal.email_whatsapp" label="Email/WhatsApp"></v-text-field-->
                            <v-text-field v-model="new_goal.llamada" label="Llamada"></v-text-field>
                            <v-text-field v-model="new_goal.visita" label="Visita"></v-text-field>
                            <!--v-text-field v-model="new_goal.entrega" label="Entrega"></v-text-field-->
                            

                            


                            <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-model="new_goal.start_date" label="Fecha Inicio" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                                </template>
                                <v-date-picker color="primary" v-model="new_goal.start_date" @input="datePicker = false"></v-date-picker>
                            </v-menu>
                        </v-col>
                        <v-col cols="6">

                            <v-text-field v-model="new_goal.muestra" label="Muestra"></v-text-field>
                            
                            <!--v-text-field v-model="new_goal.colocación_de_pedidos" label="Colocación de Pedidos"></v-text-field>
                            <v-text-field v-model="new_goal.admin" label="ADMIN"></v-text-field-->
                            <!--v-text-field v-model="new_goal.clientes_nuevos" label="Clientes Nuevos"></v-text-field-->
                            <!--v-text-field v-model="new_goal.prospectos_nuevos" label="Prospectos Nuevos"></v-text-field-->
                            <v-text-field v-model="new_goal.cotiaziones" label="Cotizaciones"></v-text-field>
                            <v-text-field v-model="new_goal.ventas" prefix="$" label="Ventas"></v-text-field>
                            <v-menu v-model="datePicker2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                                <template v-slot:activator="{ on }">
                                    <v-text-field v-model="new_goal.end_date" label="Fecha Fin" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                                </template>
                                <v-date-picker color="primary" v-model="new_goal.end_date" @input="datePicker2 = false"></v-date-picker>
                            </v-menu>
                        </v-col>

                    </v-row>
                    <v-divider></v-divider>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="grey" text @click="close()">
                            Cerrar
                        </v-btn>
                        <v-btn color="primary" text @click="save()">
                            Guardar
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-toolbar>
        <v-row class="ma-0 pa-8 tab-border" style="background:white;" id="goal_report">
            <v-card style="width:150px;" class="elevation-0 background-title">
                <v-list-item style="background:white;">
                </v-list-item>
                <v-list-item v-for="activity in activities" :key="activity.id">
                    <span>{{activity.type}}</span>
                </v-list-item>
                <!--v-list-item>
                    <span>Clientes Nuevos</span>
                </v-list-item>
                <v-list-item>
                    <span>Prospectos Nuevos</span>
                </v-list-item-->
                <v-list-item>
                    <span>Cotizaciones</span>
                </v-list-item>
                <v-list-item>
                    <span>Ventas</span>
                </v-list-item>
            </v-card>
            <v-card style="width:140px;" class="elevation-0 background-title" v-if="selected_goal!=undefined">
                <v-list-item style="background:white;">
                    <span style="text-align:center; width: 100%;">META</span>
                </v-list-item>
                <!--v-list-item>
                    <span style="text-align:center; width: 100%;">{{selected_goal.email_whatsapp}}</span>
                </v-list-item-->
                <v-list-item>
                    <span style="text-align:center; width: 100%;">{{selected_goal.llamada}}</span>
                </v-list-item>
                <v-list-item>
                    <span style="text-align:center; width: 100%;">{{selected_goal.visita}}</span>
                </v-list-item>
                <!--v-list-item>
                    <span style="text-align:center; width: 100%;">{{selected_goal.entrega}}</span>
                </v-list-item-->
                <v-list-item>
                    <span style="text-align:center; width: 100%;">{{selected_goal.muestra}}</span>
                </v-list-item>
                <!--v-list-item>
                    <span style="text-align:center; width: 100%;">{{selected_goal.colocación_de_pedidos}}</span>
                </v-list-item>
                <v-list-item>
                    <span style="text-align:center; width: 100%;">{{selected_goal.admin}}</span>
                </v-list-item>
                <v-list-item>
                    <span style="text-align:center; width: 100%;">{{selected_goal.clientes_nuevos}}</span>
                </v-list-item>
                <v-list-item>
                    <span style="text-align:center; width: 100%;">{{selected_goal.prospectos_nuevos}}</span>
                </v-list-item-->
                <v-list-item>
                    <span style="text-align:center; width: 100%;">{{selected_goal.cotiaziones}}</span>
                </v-list-item>
                <v-list-item>
                    <span style="text-align:center; width: 100%;">{{(selected_goal.ventas*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                </v-list-item>
            </v-card>
            <vue-horizontal style="width:calc(100% - 300px);" v-if="companies.length>0 && calendars.length>0 && quotations.length>0 && leads.length>0">
                <v-card style="width:140px;" v-for="(user, user_index) in users" :key="user_index" class="elevation-0">
                    <div class="background-title">
                        <v-list-item>
                            <span style="text-align:center; width: 100%;">{{user.name}}</span>
                        </v-list-item>
                    </div>
                    <v-list-item class="pa-0"  v-for="(activity, activity_index) in activities" :key="activity_index">
                        <div style="width:100%; text-align:center;">
                            <span style="text-align:center;">{{activitiesCount(activity.id, user.id)}}</span>
                            <br/>
                            <v-progress-linear :color="user.color" v-if="selected_goal!=undefined" v-model="activities_percentage[user_index][activity_index]" height="15">
                                <strong style="font-size:13px;">{{ activities_percentage[user_index][activity_index].toFixed(2) }}%</strong>
                            </v-progress-linear>
                        </div>
                    </v-list-item>
                    <!--v-list-item class="pa-0">
                        <div style="width:100%; text-align:center;">
                            <span style="text-align:center;">{{clientsCount(user.id)}}</span>
                            <br/>
                            <v-progress-linear :color="user.color" v-if="selected_goal!=undefined" v-model="percentage[user_index].clientes_nuevos" height="15">
                                <strong style="font-size:13px;">{{ percentage[user_index].clientes_nuevos.toFixed(2) }}%</strong>
                            </v-progress-linear>
                        </div>
                    </v-list-item>
                    <v-list-item class="pa-0">
                        <div style="width:100%; text-align:center;">
                            <span style="text-align:center;">{{leadsCount(user.id)}}</span>
                            <br/>
                            <v-progress-linear :color="user.color" v-if="selected_goal!=undefined" v-model="percentage[user_index].prospectos_nuevos" height="15">
                                <strong style="font-size:13px;">{{ percentage[user_index].prospectos_nuevos.toFixed(2) }}%</strong>
                            </v-progress-linear>
                        </div>
                    </v-list-item-->
                    <v-list-item class="pa-0">
                        <div style="width:100%; text-align:center;">
                            <span style="text-align:center;">{{quotationsCount(user.id)}}</span>
                            <br/>
                            <v-progress-linear :color="user.color" v-if="selected_goal!=undefined" v-model="percentage[user_index].cotiaziones" height="15">
                                <strong style="font-size:13px;">{{ percentage[user_index].cotiaziones.toFixed(2) }}%</strong>
                            </v-progress-linear>
                        </div>
                    </v-list-item>
                    <v-list-item class="pa-0">
                        <div style="width:100%; text-align:center;">
                            <span style="text-align:center;">{{(salesCount(user.id)*1).toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</span>
                            <br/>
                            <v-progress-linear :color="user.color" v-if="selected_goal!=undefined" v-model="percentage[user_index].ventas" height="15">
                                <strong style="font-size:13px;">{{ percentage[user_index].ventas.toFixed(2) }}%</strong>
                            </v-progress-linear>
                        </div>
                    </v-list-item>
                </v-card>
            </vue-horizontal>
            <div v-else class="text-center" style="width:calc(100% - 300px);">
                <v-progress-circular
                style="margin:130px auto;"
                indeterminate
                color="primary"
                ></v-progress-circular>
            </div>
        </v-row>
    </v-container>
</template>

<script>
import axios from "axios"
import VueHorizontal from 'vue-horizontal';
export default {
    data(){return{
        datePicker:false,
        datePicker2:false,
        date_filter:[],
        date_filter2:['2022-12-19','2022-12-19'],
        dialog:false,
        new_goal:{
            name:'',
            email_whatsapp:'',
            llamada:'',
            visita:'',
            entrega:'',
            muestra:'',
            colocación_de_pedidos:'',
            admin:'',
            clientes_nuevos:'',
            prospectos_nuevos:'',
            cotiaziones:'',
            ventas:'',
            start_date:'',
            end_date:''
        }
    }},
    created(){
        this.$emit("closeDrawer", false);
        var date = new Date()
        this.date_filter[0] = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
        this.date_filter[1] = new Date(date.getFullYear(), date.getMonth() + 1, 0).toLocaleString("sv-SE", {timeZone: "America/Monterrey"}).toString().slice(0, 10)
    },
    computed:{
        companies(){
            return this.$store.state.company.companies
        },
        calendars(){
            return this.$store.state.calendar.calendars
        },
        quotations(){
            return this.$store.state.quotation.quotations
        },
        leads(){
            return this.$store.state.lead.leads
        },
        percentage(){
            var perro = [{
                clientes_nuevos: 0,
                prospectos_nuevos: 0,
                cotiaziones: 0,
                ventas: 0,
            }]
            for(var i=0; i<this.users.length; i++){
                perro.push({
                    clientes_nuevos: 0,
                    prospectos_nuevos: 0,
                    cotiaziones: 0,
                    ventas: 0,
                })
                if(this.selected_goal!=undefined){
                    perro[i].clientes_nuevos = (100/this.selected_goal.clientes_nuevos)*this.clientsCount(this.users[i].id)
                    perro[i].prospectos_nuevos = (100/this.selected_goal.prospectos_nuevos)*this.leadsCount(this.users[i].id)
                    perro[i].cotiaziones = (100/this.selected_goal.cotiaziones)*this.quotationsCount(this.users[i].id)
                    perro[i].ventas = (100/this.selected_goal.ventas)*this.salesCount(this.users[i].id)
                }
            }
            return perro
        },
        activities_percentage(){
            var perro = [[]]
            for(var i=0; i<this.users.length; i++){
                for(var j=0; j<this.activities.length; j++){
                    perro.push([])
                    if(this.selected_goal!=undefined){
                        perro[i][j] = (100/this.goalActivity(this.activities[j].type))*this.activitiesCount(this.activities[j].id, this.users[i].id)
                    }
                }
            }
            return perro
        },
        selected_goal(){
            return this.$store.state.goal.goals.filter(id=>id.start_date == this.date_filter2[0] && id.end_date == this.date_filter2[1])[0]
        },
        goals(){
            return this.$store.state.goal.goals.map(id=>{
                return{
                    name:id.name,
                    dates:[id.start_date, id.end_date]
                }
            })
        },
        activities(){
            return this.$store.state.activity.activities.filter(user=>
                user.type=='Visita'||
                user.type=='Llamada'||
                user.type=='Muestra'
            )
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
                user.name!='Inhabilitado'&&
                user.name!='Araceli'
            )
        }
    },
    components: {
        VueHorizontal
    },
    methods: {
        downloadPDF(){
            var printContents = document.getElementById('goal_report').innerHTML;
            var originalContents = document.body.innerHTML;
            document.body.innerHTML = printContents;

            window.print();


            this.$nextTick(() => {
                    var is_opera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
                    var is_Edge = navigator.userAgent.indexOf("Edge") > -1;
                    var is_chrome = !!window.chrome && !is_opera && !is_Edge;
                    var is_explorer= typeof document !== 'undefined' && !!document.documentMode && !is_Edge;
                    var is_firefox = typeof window.InstallTrigger !== 'undefined';
                    var is_safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
                if(is_opera || is_Edge || is_chrome || is_explorer || is_firefox){
                    document.body.innerHTML = originalContents;
                    location.reload();
                }
            })
        },
        goalActivity(activity){
            switch(activity){
                case 'Email/WhatsApp' : return this.selected_goal.email_whatsapp
                case 'Llamada' : return this.selected_goal.llamada
                case 'Visita' : return this.selected_goal.visita
                case 'Entrega' : return this.selected_goal.entrega
                case 'Muestra' : return this.selected_goal.muestra
                case 'Colocación de Pedidos' : return this.selected_goal.colocación_de_pedidos
                case 'ADMIN' : return this.selected_goal.admin
            }
        },
        save(){
            axios.post("https://backendduramax.unocrm.mx/api/v1/goal/create",Object.assign(this.new_goal)).then(response=>{
                this.close()
            })
        },
        close(){
            this.new_goal = Object.assign({}, this.defaultItem)
            this.$nextTick(() => {
                this.dialog = false
                this.$store.dispatch('goal/getGoals')
            })
        },
        activitiesCount(activity_id, user_id){
            var response = this.calendars.filter(calendar=>calendar.activity_id == activity_id).filter(calendar=>calendar.user_id == user_id)
            if(this.date_filter!=undefined && this.date_filter.length==2){
                response = this.filterByDate(response)
            }
            return response.length
        },
        clientsCount(user_id){
            var response = this.companies.filter(company=>company.user_id == user_id)
            if(this.date_filter!=undefined && this.date_filter.length==2){
                response = this.filterByDate(response)
            }
            return response.length
        },
        leadsCount(user_id){
            var response = this.leads.filter(lead=>lead.user_id == user_id)
            if(this.date_filter!=undefined && this.date_filter.length==2){
                response = this.filterByDate(response)
            }
            return response.length
        },
        quotationsCount(user_id){
            var response = this.quotations.filter(quotation=>quotation.status == 'quotation').filter(quotation=>quotation.user_id == user_id)
            if(this.date_filter!=undefined && this.date_filter.length==2){
                response = this.filterByDate(response)
            }
            return response.length
        },
        salesCount(user_id){
            var response = this.quotations.filter(quotation=>quotation.status == 'vendido').filter(quotation=>quotation.user_id == user_id)
            if(this.date_filter!=undefined && this.date_filter.length==2){
                response = this.filterByDate(response)
            }
            return response.reduce((acumulador, actual) => acumulador + actual.amount, 0);
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