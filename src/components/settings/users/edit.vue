<template>    
    <v-card>
        <!-- Titulo del dialogo -->
        <v-card-title>
            Crear Usuario
        </v-card-title>
        <v-divider></v-divider>
            <!-- Formulario -->
        <v-form ref="form">
            <v-row class="py-3 px-6">
                <v-col cols="12" sm="6" md="4">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.name" label="Nombre"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.email" label="Email"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.phone" label="Teléfono"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="12" class="pt-1">
                    <v-select :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.permissions" :items="permissions" item-text="text" item-value="value" chips label="Permisos" multiple></v-select>
                </v-col>
            </v-row>
        </v-form>
        <v-card-actions class="pt-4">
            <v-menu :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                <template v-slot:activator="{ on }">
                    <v-chip class="ma-2 mt-0" :color="editedItem.color" text-color="white" v-on="on"><v-avatar left><v-icon color="#676767"> mdi-palette</v-icon></v-avatar> Color Calendario</v-chip>
                </template>
                <v-color-picker :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.color" class="ma-2"></v-color-picker>
            </v-menu> 
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
            <v-btn color="blue darken-1" text :disabled="!valid" @click="save">Guardar</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
import axios from "axios";
export default {
    props:{
        editedItem:Object
    },
    data:()=>({  
        disable:'',
        valid: true,
        rules: {
            required: value => !!value || 'Campo requerido',
        },
        createCategory:{
            name:'',
        },
    }),
    computed:{
        permissions(){
            return [
                {text: 'Ver Empresas', value: 'viewCompanies'},
                {text: 'Editar Empresas', value: 'editCompanies'},
                {text: 'Eliminar Empresas', value: 'deleteCompanies'},
                {text: 'Asignar Empresas', value: 'assignCompanies'},

                {text: 'Ver Contactos', value: 'viewContacts'},
                {text: 'Editar Contactos', value: 'editContacts'},
                {text: 'Eliminar Contactos', value: 'deleteContacts'},
                {text: 'Asignar Contactos', value: 'assignContacts'},

                {text: 'Ver Cotizaciones', value: 'viewQuotation'},
                {text: 'Editar Cotizaciones', value: 'editQuotation'},
                {text: 'Eliminar Cotizaciones', value: 'deleteQuotation'},
                {text: 'Asignar Cotizaciones', value: 'assignQuotation'},

                {text: 'Ver Actividades', value: 'viewActivities'},
                {text: 'Editar Actividades', value: 'editActivities'},
                {text: 'Eliminar Actividades', value: 'deleteActivities'},
                {text: 'Asignar Actividades', value: 'assignActivities'},

                {text: 'Acceso a Catálogos', value: 'catalogs'},
                {text: 'Acceso a Inventario', value: 'inventory'},
                {text: 'Acceso a Usuarios', value: 'users'},
                {text: 'Acceso a Bitacoras', value: 'activityLog'},
                {text: 'Acceso a Reportes', value: 'reports'},
                {text: 'Eliminar Notas', value: 'deleteNotes'},
            ]
        }
    },
    methods:{
        close () {
            this.$nextTick(() => {
                this.$emit("closeDialogItem", false);
            })
        },
        save () {
            
            axios.put("https://backendduramax.unocrm.mx/api/v1/user/update",Object.assign(this.editedItem)).then(response=>{
                this.close()
            })
            
        }
    }
}
</script>