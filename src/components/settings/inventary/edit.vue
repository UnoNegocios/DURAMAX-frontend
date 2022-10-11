<template>    
    <v-card>
        <!-- Titulo del dialogo -->
        <v-card-title>
            Editar Producto | Servicio
        </v-card-title>
        <v-divider></v-divider>
            <!-- Formulario -->
        <v-form ref="form">
            <v-row class="py-3 px-6">
                <v-col cols="12" sm="6" md="4" class="mb-0 pb-0">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.name" label="Nombre"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4" class="mb-0 pb-0">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.price" label="Valor"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4" class="mb-0 pb-0">
                    <v-autocomplete :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.category_id" :items="categories" label="Categoría" item-text="name" item-value="id">
                        <template slot="no-data">
                            <div class="px-6 pt-3">
                                No existen categorías relacionadas.
                                <v-text-field v-if="disable==false" v-model="createCategory.name" label="Nueva Categoría" append-icon="mdi-plus" @click:append="saveCategory()"></v-text-field>
                            </div>
                        </template>
                    </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="12" md="12" class="mt-0 pt-0">
                    <v-textarea v-model="editedItem.description" label="Descripción"></v-textarea>
                </v-col>
            </v-row>
        </v-form>
        <v-card-actions class="pt-4">
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
    created(){
        
    },
    computed:{
        categories:{
            get(){
                return this.$store.state.category.categories;
            }
        },
    },
    methods:{
        close () {
            this.$nextTick(() => {
                this.$emit("closeDialogItem", false);
            })
        },
        save () {

            axios.put("https://backendduramax.unocrm.mx/api/v1/item/update",Object.assign(this.editedItem)).then(response=>{
                this.close()
            })
            
        },
        saveCategory(){
            
            axios.post("https://backendduramax.unocrm.mx/api/v1/category/create",Object.assign(this.createCategory)).then(response=>{
                this.$store.dispatch('category/getCategories')
                this.disable = true
                this.createCategory.name=''
            }) 
        }
    }
}
</script>