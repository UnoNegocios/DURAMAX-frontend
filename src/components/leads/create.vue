<template>    
    <v-card>
        <!-- Titulo del dialogo -->
        <v-row class="ma-0">
            <v-card-title>
                Crear Prospecto
            </v-card-title>
            <v-spacer/>
            <div class="pr-4">
                <v-autocomplete v-if="permissions('assignActivities')" :rules="[v => !!v || 'Campo requerido']" clearable v-model="editedItem.user_id" :items="usersLists" label="Responsable" item-text="name" item-value="id">
                    <template slot="no-data" class="pa-2">No existen usuarios relacionados.</template>                      
                </v-autocomplete>
                <v-autocomplete v-else-if="editedItem.user_id=currentUser.id" disabled v-model="editedItem.user_id" :items="usersLists" label="Asesor Comercial" item-text="name" item-value="id">                
                </v-autocomplete>
            </div>
        </v-row>
        <v-divider></v-divider>
        <!-- Formulario -->
        <v-form ref="form">
            <v-card class="elevation-0">
                <v-row class="ma-0 px-4">
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.name" label="Nombre de Contacto"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.email" label="Correo"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.phone" label="Teléfono"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.zone" label="Región"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.company" label="Razón Social"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-autocomplete clearable v-model="editedItem.origin_id" :items="originLists" label="Procedencia" item-text="name" item-value="id">
                            <template slot="no-data" class="pa-2">No existen procedencias relacionadas.</template>                      
                        </v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.subject" label="Asunto"></v-text-field>
                        <v-menu v-model="datePicker" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                            <template v-slot:activator="{ on }">
                                <v-text-field :rules="[v => !!v || 'Campo requerido']" clearable required v-model="editedItem.date" label="Fecha" prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                            </template>
                            <v-date-picker color="primary" v-model="editedItem.date" @input="datePicker = false"></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col cols="12" sm="6" md="8">
                        <v-container fluid>
                            <v-textarea v-model="editedItem.comments" label="Comentarios"></v-textarea>
                        </v-container>
                    </v-col>
                </v-row>
                <v-card-actions class="pt-4">
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                    <v-btn color="blue darken-1" text :disabled="grey || gris" @click="save" :loading="gris">Guardar</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </v-card>
</template>
<script>
import axios from "axios";
export default {
    data:()=>({  
            gris:false,
        datePicker:'',
        valid: true,
        editedItem: {
            name:'',
            date:'',
            email:'',
            phone:'',
            zone:'',
            company:'',
            origin_id:'',
            subject:'',
            user_id:'',
            comments:''
        },
        rules: {
            required: value => !!value || 'Campo requerido',
        },
    }),
    computed:{
        grey(){
            if(this.editedItem.company!=''&&this.editedItem.name!=''){
                return false
            }else{
                return true
            }
        },
        currentUser:{
            get(){
                return this.$store.state.currentUser.user;
            }
        },
        usersLists:{
            get(){
                return this.$store.state.user.users
            }
        },
        originLists(){
            return this.$store.state.origin.origins;
        },
    },
    methods:{
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
            console.log('gato')
            this.editedItem = Object.assign({}, this.defaultItem)
            this.$nextTick(() => {
                console.log('raton')
                this.$emit("closeDialogCreateLead", false);
            })
        },
        save () {
            this.gris = true
            axios.post("https://backendduramax.unocrm.mx/api/v1/lead/create",Object.assign(this.editedItem)).then(response=>{
                this.gris = false
                this.close()
            })
        },
    }
}
</script>