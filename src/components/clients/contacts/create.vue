<template>
    <v-card>
        <v-card-title class="py-3" >
            <span >Nuevo contacto</span> 
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0">
            <v-container>
                <v-row>
                    <v-col class="pt-2 pb-0" cols="12" sm="6" md="2">
                        <v-list-item-avatar class="ml-2">
                            <img src="https://backendduramax.unocrm.mx/files/default.jpg">
                        </v-list-item-avatar>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="5">
                        <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="contact.name" label="Nombre"></v-text-field>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="5">
                        <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="contact.last" label="Apellido"></v-text-field>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="2">
                        <v-icon class="pa-4" color="primary">mdi-email-outline</v-icon>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="10">
                        <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="contact.email" label="Correo Electrónico"></v-text-field>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="2">
                        <v-icon class="pa-4" color="primary">mdi-phone-outline</v-icon>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="10">
                        <vue-tel-input-vuetify :rules="[v => !!v || 'Campo requerido']" type="number" v-model="contact.phone" label="Teléfono"></vue-tel-input-vuetify>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="2">
                        <v-icon class="pa-4" color="primary">mdi-domain</v-icon>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="5">
                        <v-text-field disabled v-model="companyName">               
                        </v-text-field>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="5">
                        <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="contact.job_position" label="Puesto"></v-text-field>
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
        props:{
            company:String
        },
        data: () => ({
            gris:false,
            contact:{
                name:'',
                last:'',
                phone:'',
                email:'',
                company_id:'',
                job_position:'',
                user_id:''
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
        companyName(){
            return this.companyLists.filter(company=>company.id == this.company).map(company=>company.name)[0]
        },
        companyLists(){
            return this.$store.state.company.companies;
        },
        salesmen(){
            return this.companyLists.filter(company=>company.id == this.company).map(company=>company.user_id)[0]
        }
    },
    created(){
        
    },
    watch: {
    
    },
    methods: {
        close () {
            this.contact = Object.assign({}, this.defaultItem)
            this.$nextTick(() => {
                this.$emit("closeCreateDialogContact", false);
            })
        },
        save () {
            this.gris = true
                this.contact.user_id = this.salesmen
                this.contact.company_id = this.company
                this.contact.phone = (Number(this.contact.phone.replace(/\s/g, ''))).toString()
            axios.post("https://backendduramax.unocrm.mx/api/v1/contact/create",Object.assign(this.contact)).then(response=>{
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
.v-text-field input, .v-label {
    font-size: 14px;
}
</style>