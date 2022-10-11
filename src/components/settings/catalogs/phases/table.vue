

<template>       
    <v-data-table expand-icon :headers="headers" :items="etapas" class="elevation-0">
        <template slot="no-data">
            No existen etapas registradas.
        </template>
        <template v-slot:[`item.color`]="{ item }">
            <v-chip outlined class="pa-2" small :color="item.color"> Color Etiqueta</v-chip>
        </template >
        <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="edit(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:top>    
            <v-dialog v-model="dialog" max-width="600px">
                <editPhases @closeDialogPhase="closeDialogPhase" v-bind:editedPhase="editedItem"/>
            </v-dialog> 
        </template>
  </v-data-table>
</template>
<script>
import editPhases from "../phases/edit"
import axios from "axios";
export default {
    components: {
        'editPhases':editPhases,
    },
    data:()=>({  
        editedItem:'',
        headers:[
            {text: 'Etapa', value:'name'},
            {text: 'Días', value: 'days'},
            {text: 'Color', value: 'color'},
            {text: 'Estatus', value: 'status_id'},
            {text: 'Acciones', value: 'actions', sortable: false },
        ],
        dialog:false,
    }),
    computed:{
        etapas:{
            get(){
                return this.$store.state.phase.phases;
            }
        },
    },
    methods:{
        deleteItem (item) {
            let id = item.id
            if (confirm('¿Seguro que deseas borrar esta etapa?')) {
            axios.delete("https://backendduramax.unocrm.mx/api/v1/phase/delete/"+id).then(response => {
                this.$store.dispatch('phase/getPhases')
            });
            }
        },
        edit(item){
            this.editedItem = item
            this.dialog = true
        },
        closeDialogPhase: function(params) {
            this.dialog = params;
            this.$store.dispatch('phase/getPhases')
        },
    },
    created(){
        this.$store.dispatch('phase/getPhases')
    },
}
</script>