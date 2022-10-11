

<template>       
    <v-data-table expand-icon :headers="headers" :items="activities" class="elevation-0">
        <template slot="no-data">
            No existen tipos de actividades registrados.
        </template>
        <template v-slot:[`item.color`]="{ item }">
            <v-chip class="pa-2" small :color="item.color" outlined>Color Realizado</v-chip>
        </template>
        <template v-slot:[`item.colorNo`]="{ item }">
            <v-chip class="pa-2" small :color="item.color" outlined style="filter:opacity(0.5);">Color No Realizado</v-chip>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
            <v-icon small class="mr-2" @click="edit(item)">mdi-pencil</v-icon>
            <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
        </template>
        <template v-slot:top>    
            <v-dialog v-model="dialog" max-width="350px">
                <editType @closeDialogoType="closeDialogoType" v-bind:editedType="editedItem"/>
            </v-dialog> 
        </template>
  </v-data-table>
</template>
<script>
import editType from "../types/edit"
import axios from "axios";
export default {
    components: {
        'editType':editType,
    },
    data:()=>({  
        editedItem:'',
        headers:[
            {text: 'Tipo de Actividad', value:'type'},
            {text: 'Color Realizado', value: 'color'},
            {text: 'Color No Realizado', value: 'colorNo'},
            {text: 'Acciones', value: 'actions', sortable: false },
        ],
        dialog:false,
    }),
    computed:{
        activities:{
            get(){
                return this.$store.state.activity.activities;
            }
        },
    },
    methods:{
        deleteItem (item) {
            let id = item.id
                if (confirm('¿Seguro que deseas borrar este tipo de actividad?')) {
                axios.delete("https://backendduramax.unocrm.mx/api/v1/activity/delete/"+id).then(response => {
                    this.$store.dispatch('activity/getActivities')
                });
            }
        },
        edit(item){
            this.editedItem = item
            this.dialog = true
        },
        closeDialogoType: function(params) {
            this.dialog = params;
            this.$store.dispatch('activity/getActivities')
        },
    },
    created(){
        this.$store.dispatch('activity/getActivities')
    },
}
</script>