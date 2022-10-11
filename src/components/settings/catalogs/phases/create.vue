<template>    
    <v-card>
        <!-- Titulo del dialogo -->
        <v-card-title>
            Crear Etapa
        </v-card-title>
        <v-divider></v-divider>
            <!-- Formulario -->
        <v-form ref="form">
            <v-row class="py-3 px-6">
                <v-col cols="12" sm="6" md="3">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.name" label="Etapa"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.days" label="Dias"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                    <v-select :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.status_id" :items="status" item-text="name" item-value="id" label="Estatus"></v-select>
                </v-col>
                <v-col class="pt-5" cols="12" sm="6" md="3">
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
            name:'',
            days:'',
            color:'',
            status_id:'',
        },
        rules: {
            required: value => !!value || 'Campo requerido',
        },
    }),
    created(){
        this.$store.dispatch('status/getStatuses')
    },
    computed:{
        status:{
            get(){
                return this.$store.state.status.statuses;
            }
        },
    },
    methods:{
        close () {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.editedItem.color = '#e0e0e0'
            this.$nextTick(() => {
                this.$emit("closeDialogPhase", false);
            })
        },
        save () {
            
            axios.post("https://backendduramax.unocrm.mx/api/v1/phase/create",Object.assign(this.editedItem)).then(response=>{
                this.close()
            })
            
        },
    }
}
</script>