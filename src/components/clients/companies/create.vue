<template>
    <v-card>
        <v-card-title class="pb-0 pt-1" >
            <v-icon style="background: #e7e8e9; padding: 10px!important; border-radius: 50%;" class="mr-4">mdi-domain</v-icon>
            <span >Nuevo Cliente</span>
            <v-spacer></v-spacer>
            <v-col cols="12" sm="6" md="4">
                <v-autocomplete v-if="permissions('assignCompanies')" clearable v-model="company.user_id" :items="usersLists" label="Responsable" item-text="name" item-value="id">
                    <template slot="no-data" class="pa-2">No existen usuarios relacionados.</template>                      
                </v-autocomplete>
                <v-autocomplete v-else-if="company.user_id=currentUser.id" disabled v-model="company.user_id" :items="usersLists" label="Responsable" item-text="name" item-value="id">                
                </v-autocomplete>
            </v-col>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0">
            <v-container>
            <v-row>
                <v-col cols="12" sm="6" md="8">
                    <v-row>
                        <v-col cols="12" class="pb-0" sm="6" md="6">
                            <v-text-field prepend-inner-icon="mdi-account" :rules="[v => !!v || 'Campo requerido']" v-model="company.name" label="Razón Social"></v-text-field>
                        </v-col>
                        <v-col cols="12" class="pb-0" sm="6" md="6">
                            <vue-tel-input-vuetify :rules="[v => !!v || 'Campo requerido']" type="number" v-model="company.phone" label="Teléfono"></vue-tel-input-vuetify>
                        </v-col>
                        <v-col class="pt-0" cols="12" sm="6" md="6">
                            <v-text-field prepend-inner-icon="mdi-email" :rules="[v => !!v || 'Campo requerido']" v-model="company.email" label="Correo Electrónico"></v-text-field>
                        </v-col>
                        <v-col class="pt-0" cols="12" sm="6" md="6">
                            <v-text-field prepend-inner-icon="mdi-map-marker" :rules="[v => !!v || 'Campo requerido']" v-model="company.address" label="Dirección"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="py-0" cols="12" sm="6" md="6">
                            <v-autocomplete :rules="[v => !!v || 'Campo requerido']" clearable v-model="company.state_id" :items="stateLists" label="Estado" item-text="state" item-value="id">
                                <template slot="no-data" class="pa-2">No existen estados relacionados.</template>                      
                            </v-autocomplete>
                        </v-col>
                        <v-col v-if="company.state_id!=null" class="py-0" cols="12" sm="6" md="6">
                            <v-autocomplete :rules="[v => !!v || 'Campo requerido']" clearable v-model="company.city_id" :items="cityLists" label="Ciudad" item-text="city" item-value="id">
                                <template slot="no-data" class="pa-2">No existen ciudades relacionadas.</template>                      
                            </v-autocomplete>
                        </v-col>
                    </v-row>
                    <!--v-btn class="pa-0 mt-4" @click="fiscales=!fiscales" color="primary" text>datos fiscales 
                        <v-icon v-if="fiscales==false"> mdi-menu-down</v-icon>
                        <v-icon v-if="fiscales==true"> mdi-menu-up</v-icon>
                    </v-btn>
                    <v-row v-if="fiscales==true"> 
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="company.razon_social" label="Razon Social"></v-text-field>
                        </v-col>
                        <v-col cols="12" sm="6" md="6">
                            <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="company.rfc" label="RFC"></v-text-field>
                        </v-col>
                    </v-row-->
                </v-col>
                <v-col cols="12" sm="6" md="4">
                    <v-row style="background-color: #94949417;" class="px-2 ma-2 py-2">
                
                        <v-col class="py-0" cols="12" sm="6" md="12">
                            <v-autocomplete clearable v-model="company.origin_id" :items="originLists" label="Procedencia" item-text="name" item-value="id">
                                <template slot="no-data" class="pa-2">No existen procedencias relacionadas.</template>                      
                            </v-autocomplete>
                        </v-col>
                        <v-col class="py-0" cols="12" sm="6" md="12">
                            <v-autocomplete clearable v-model="company.status_id" :items="statusLists" label="Estatus" item-text="name" item-value="id">
                                <template slot="no-data" class="pa-2">No existen estatus relacionados.</template>                      
                            </v-autocomplete>
                        </v-col>
                        <v-col class="py-0" cols="12" sm="6" md="12">
                            <v-autocomplete clearable v-model="company.phase_id" :items="phaseLists" label="Etapa" item-text="name" item-value="id">
                                <template slot="no-data" class="pa-2">No existen etapas relacionadas.</template>                      
                            </v-autocomplete>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">
                Cancelar
            </v-btn>
            <v-btn color="blue darken-1" text @click="save" :disabled="gris" :loading="gris">
                Guardar
            </v-btn>
        </v-card-actions>

    </v-card>
</template>

<script>
import axios from "axios";
    export default {
        data: () => ({
            gris:false,
            fiscales:false,
            company:{
                user_id:'',
                phase_id:'',
                origin_id:'',
                status_id:'',
                name:'',
                address:'',
                phone:'',
                email:'',
                rfc:'',
                razon_social:'',
                state_id:null,
                city_id:''
            },
            rules: {
                required: value => !!value || 'Campo requerido',
            },
            valid: true,
        }),
    computed: {
        usersLists(){
            return this.$store.state.user.users;
        },
        originLists(){
            return this.$store.state.origin.origins;
        },
        phaseLists(){
            return this.$store.state.phase.phases;
        },
        statusLists(){
            return this.$store.state.status.statuses;
        },
        stateLists(){
            return this.$store.state.state.states;
        },
        cityLists(){
            return this.$store.state.city.cities.filter(city=>city.state == this.company.state_id);
        },
        currentUser:{
            get(){
            return this.$store.state.currentUser.user
            }
        }
    },
    created(){
        this.$store.dispatch('currentUser/getUser')
        this.$store.dispatch('user/getUsers')
        this.$store.dispatch('origin/getOrigins')
        this.$store.dispatch('phase/getPhases')
        this.$store.dispatch('status/getStatuses')
        this.$store.dispatch('state/getStates')
        this.$store.dispatch('city/getCities')
    },
    watch: {
    
    },
    methods: {
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
        close () {
            this.company = Object.assign({}, this.defaultItem)
            this.$nextTick(() => {
                this.$emit("closeCreateDialogCompany", false);
            })
        },
        save () {
            this.gris = true
            this.company.user_id = this.currentUser.id
            this.company.phone = (Number(this.company.phone.replace(/\s/g, ''))).toString()
            axios.post("https://backendduramax.unocrm.mx/api/v1/company/create",Object.assign(this.company)).then(response=>{
                this.gris = false
                this.close()
            })
            
        },
    },
}
</script>
<style lang="css" scoped>
.v-text-field >>> label{
    font-size: 14px!important;
}
</style>
<style>
.v-input__icon--prepend-inner i::before {
    font-size: 18px!important;
    color:#1976D2;
}
.v-text-field input, .v-label {
    font-size: 14px;
}
</style>