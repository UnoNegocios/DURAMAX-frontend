<template>
    <v-card>
        <v-card-title class="py-3" >
            <span >Nuevo contacto</span>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0">
            <v-container>
                <v-row>
                    <v-col class="py-1" cols="12" sm="6" md="2">
                        <v-list-item-avatar>
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
                        <v-icon class="pa-4">mdi-email-outline</v-icon>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="10">
                        <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="contact.email" label="Correo Electrónico"></v-text-field>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="2">
                        <v-icon class="pa-4">mdi-phone-outline</v-icon>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="10">
                        <vue-tel-input-vuetify :rules="[v => !!v || 'Campo requerido']" v-model="contact.phone" label="Teléfono"></vue-tel-input-vuetify>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="2">
                        <v-icon class="pa-4">mdi-domain</v-icon>
                    </v-col>
                    <v-col class="py-0" cols="12" sm="6" md="5">
                        <v-autocomplete disabled v-model="contact.company_id" :items="companyLists" label="Empresa" item-text="name" item-value="id">               
                        </v-autocomplete>
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
            contact:Object
        },
        data: () => ({
            gris:false,
            rules: {
                required: value => !!value || 'Campo requerido',
            },
            valid: true,
        }),
    computed: {
        companyLists(){
            return this.$store.state.company.companies;
        },
    },
    created(){
        this.$store.dispatch('company/getCompanies')
    },
    methods: {
        close () {
            this.$emit("closeDialogEditContact", false);
        },
        save () {
            this.gris = true
            this.contact.phone = Number(this.contact.phone.replace(/\s/g, ''))
            axios.put("https://backendduramax.unocrm.mx/api/v1/contact/update",Object.assign(this.contact)).then(response=>{
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
    .v-text-field input{
        font-size: 14px!important;
    }
</style>