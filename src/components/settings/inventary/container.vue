

<template>
    <div class="padding1" style="background:#f4f5fa; min-height:80vh;">  
        <v-card v-if="info==true" style="background:transparent;" class="elevation-0 pb-6 px-7">
            <v-card-text class="py-3 px-6" style="background:#1976d1; color:white; border-radius: 5px;">
                <v-icon color="white" small class="mr-2">mdi-information-outline</v-icon>
                Lorem ipsum dolor sit amet consectetur adipiscing elit massa imperdiet, mauris tortor platea fringilla sodales ac magna sociosqu, natoque non rutrum nec auctor vestibulum congue eget. 
                <v-icon style="position:absolute!important; top:7px; right:30px;" color="white" @click="info=false" small class="mr-2">mdi-close</v-icon>
            </v-card-text>
        </v-card> 
        <v-card style="background:transparent;" class="elevation-0 pb-4 padding2">
            <v-card-title style="background:white;">Productos | Servicios 
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small class="ml-4">mdi-information-outline</v-icon>
                    </template>
                    <span>Right tooltip</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-btn @click="createDialog=true" class="elevation-0" style="height:30px; font-size:13px; font-weight: 400; text-transform:capitalize; color: #1976d1; background-color: rgb(25 118 209 / 10%)!important;" color="primary" dark>Agregar Nuevo</v-btn>
            </v-card-title>
            <v-data-table expand-icon :headers="headers" :items="items" class="elevation-0">
                <template slot="no-data">
                    No existen procedencias registradas.
                </template>
                <template v-slot:[`item.category_id`]="{ item }">
                    {{category(item.category_id)}}
                     
                </template>

                <template v-slot:[`item.price`]="{ item }">
                    {{item.price.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}
                </template>

                <template v-slot:[`item.image`]="{ item }">
                    <v-img :src="'https://backendduramax.unocrm.mx/files/'+item.image" max-width="100" height="auto" width="100" class="ma-2"></v-img>
                </template>

                
                <template v-slot:[`item.actions`]="{ item }">
                    <v-icon small class="mr-2" @click="edit(item)">mdi-pencil</v-icon>
                    <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>
                </template>
            </v-data-table>
            <v-dialog v-model="editDialog" max-width="600px">
                <editItem @closeDialogItem="closeDialogItem" v-bind:editedItem="editedItem"/>
            </v-dialog> 
            <v-dialog v-model="createDialog" max-width="600px">
                <createItem @closeDialogItem="closeDialogItem"/>
            </v-dialog> 

        </v-card>
    </div>
</template>
<script>
import axios from "axios";
import editItem from "../inventary/edit"
import createItem from "../inventary/create"
export default {
    components: {
        'editItem':editItem,
        'createItem':createItem,
    },
    data:()=>({  
        editDialog:false,
        createDialog:false,
        info:true,
        editedItem:'',
        headers:[
            {text: 'Imagen', value: 'image'},
            {text: 'Nombre', value: 'name'},
            {text: 'Decripción', value: 'description'},
            {text: 'Valor', value: 'price'},
            {text: 'Categoría', value: 'category_id'},
            {text: 'Acciones', value: 'actions', sortable: false },
        ],
        dialog:false,
    }),
    computed:{
        items:{
            get(){
                return this.$store.state.item.items;
            }
        },
    },
    methods:{
        deleteItem (item) {
            let id = item.id
            if (confirm('¿Seguro que deseas borrar este producto/servicio?')) {
            axios.delete("https://backendduramax.unocrm.mx/api/v1/item/delete/"+id).then(response => {
                this.$store.dispatch('item/getItems')
            });
            }
        },
        edit(item){
            this.editedItem = item
            this.editDialog = true
        },
        closeDialogItem: function(params) {
            this.editDialog = params;
            this.createDialog = params;
            this.$store.dispatch('item/getItems')
        },
        category(id){
            return this.$store.state.category.categories.filter(category=>category.id == id).map(category => category.name)[0];
        }
    },
    created(){
        
    },
}
</script>