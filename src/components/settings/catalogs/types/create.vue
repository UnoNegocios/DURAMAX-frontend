<template>    
    <v-card>
        <!-- Titulo del dialogo -->
        <v-card-title>
            Crear Tipo de Actividad
        </v-card-title>
        <v-divider></v-divider>
            <!-- Formulario -->
        <v-form ref="form">
            <v-row class="py-3 px-6">
                <v-col cols="12" sm="6" md="8">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.type" label="Type"></v-text-field>
                </v-col>
                <v-col class="pt-5" cols="12" sm="6" md="4">
                    <v-menu :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                        <template v-slot:activator="{ on }">
                            <v-chip class="ma-2" :color="editedItem.color" text-color="white" v-on="on"><v-avatar left><v-icon color="#676767"> mdi-palette</v-icon></v-avatar> Color</v-chip>
                        </template>
                        <v-color-picker :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.color" class="ma-2"></v-color-picker>
                    </v-menu> 
                </v-col>
            </v-row>
        </v-form>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
            <v-btn color="blue darken-1" text :disabled="!valid" @click="save">Guardar</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
import axios from "axios";
export default {
    data:()=>({  
        valid: true,
        editedItem: {
            type:'',
            color:'',
        },
        rules: {
            required: value => !!value || 'Campo requerido',
        },
    }),
    methods:{
        colorNo(){
            return this.editedItem.color+'bd'
        },
        close () {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.editedItem.color = '#e0e0e0'
            this.$nextTick(() => {
                this.$emit("closeDialogType", false);
            })
        },
        save () {
            
            axios.post("https://backendduramax.unocrm.mx/api/v1/activity/create",Object.assign(this.editedItem)).then(response=>{
                this.close()
            })
        },
    }
}
</script>