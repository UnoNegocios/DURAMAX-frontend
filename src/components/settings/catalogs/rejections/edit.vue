<template>    
    <v-card>
        <!-- Titulo del dialogo -->
        <v-card-title>
            Editar Motivo de Rechazo
        </v-card-title>
        <v-divider></v-divider>
        <!-- Formulario -->
        <v-form ref="form">
            <v-row class="py-3 px-6">
                <v-col cols="12" sm="6" md="4">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedRejection.name" label="Estatus"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="8">
                    <v-card-actions class="pt-4">
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                        <v-btn color="blue darken-1" text :disabled="!valid" @click="save">Guardar</v-btn>
                    </v-card-actions>
                </v-col>
            </v-row>
        </v-form>
    </v-card>
</template>
<script>
import axios from "axios";
export default {
    props:{
        editedRejection:Object
    },
    data:()=>({  
        valid: true,
        rules: {
            required: value => !!value || 'Campo requerido',
        },
    }),
    methods:{
        close () {
            this.$nextTick(() => {
                this.$emit("closeDialogRejection", false);
            })
        },
        save () {
            
            axios.put("https://backendduramax.unocrm.mx/api/v1/rejection/update",Object.assign(this.editedRejection)).then(response=>{
                this.close()
            })
            
        },
    }
}
</script>