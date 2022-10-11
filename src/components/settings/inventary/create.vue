<template>    
    <v-card>
        <!-- Titulo del dialogo -->
        <v-card-title>
            Crear Producto
        </v-card-title>
        <v-divider></v-divider>
            <!-- Formulario -->
        <v-form ref="form">
            <v-row class="py-3 px-6">
                <v-col cols="12" sm="6" md="4"  class="mb-0 pb-0">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.name" label="Nombre"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4"  class="mb-0 pb-0">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.price" label="Valor"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="4"  class="mb-0 pb-0">
                    <v-autocomplete :rules="[v => !!v || 'Campo requerido']" v-model="editedItem.category_id" :items="categories" label="Categoría" item-text="name" item-value="id">
                        <template slot="no-data">
                            <div class="px-6 pt-3">
                                No existen categorías relacionadas.
                                <v-text-field v-model="createCategory.name" label="Nueva Categoría" append-icon="mdi-plus" @click:append="saveCategory()"></v-text-field>
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
            <v-menu top offset-x>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn style="font-size:12px;" text v-bind="attrs" v-on="on">
                        <v-icon class="mr-2">mdi-attachment</v-icon> Adjuntar archivo
                    </v-btn>
                </template>
                <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" :useCustomSlot="true" v-on:vdropzone-success="uploadSuccess" v-on:vdropzone-error="uploadError" v-on:vdropzone-removed-file="fileRemoved"/>
            </v-menu>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
            <v-btn color="blue darken-1" text :disabled="!valid" @click="save">Guardar</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import axios from "axios";
export default {
    components: {
        vueDropzone: vue2Dropzone
    },  
    data:()=>({ 
        dropzoneOptions: {
            url: "https://backendduramax.unocrm.mx/api/v1/item/image",
            addRemoveLinks: true,
            maxFiles: 1
        }, 
        disable:'',
        valid: true,
        editedItem: {
            name:'',
            price:'',
            category_id:'',
            image:'',
            description:''
        },
        createCategory:{
            name:'',
        },
        rules: {
            required: value => !!value || 'Campo requerido',
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
        uploadSuccess(file, response) {
            console.log('File Successfully Uploaded with file name: ' + response.file);
            this.editedItem.image = response.file;
        },
        uploadError(file, message) {
            console.log('An Error Occurred');
        },
        fileRemoved() {
            
        },
        close () {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.$nextTick(() => {
                this.$emit("closeDialogItem", false);
            })
        },
        save () {

            axios.post("https://backendduramax.unocrm.mx/api/v1/item/create",Object.assign(this.editedItem)).then(response=>{
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