<template>    
    <v-card>
        <!-- Titulo del dialogo -->
        <v-card-title>
            Editar Procedencia
        </v-card-title>
        <v-divider></v-divider>
        <!-- Formulario -->
        <v-form ref="form">
            <v-row class="py-3 px-6">
                <v-col cols="12" sm="6" md="4">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedOrigin.name" label="Estatus"></v-text-field>
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
        editedOrigin:Object
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
                this.$emit("closeDialogOrigin", false);
            })
        },
        save () {
            axios.put("https://backendduramax.unocrm.mx/api/v1/origin/update",Object.assign(this.editedOrigin)).then(response=>{
                this.close()
            })
            
        },
    }
}
</script>