<template>
    <v-card>
        <v-card-title class="pb-0 pt-1" >
            <v-icon style="background: #e7e8e9; padding: 10px!important; border-radius: 50%;" class="mr-4">mdi-file-document-outline</v-icon>
            <span >Nueva Cotización</span>
            <v-spacer></v-spacer>
            <v-col cols="12" sm="6" md="4">
                <v-autocomplete  :rules="[v => !!v || 'Campo requerido']" v-if="permissions('assignCompanies')" clearable v-model="quotation.user_id" :items="usersLists" label="Responsable" item-text="name" item-value="id">
                    <template slot="no-data" class="pa-2">No existen usuarios relacionados.</template>                      
                </v-autocomplete>
                <v-autocomplete v-else-if="quotation.user_id=currentUser.id" disabled v-model="quotation.user_id" :items="usersLists" label="Responsable" item-text="name" item-value="id">                
                </v-autocomplete>
            </v-col>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pb-0">
            <v-container>
                <v-row>
                    <v-col cols="12" sm="6" md="5">
                        <v-row>
                            <v-col class="py-0" cols="12" sm="6" md="6">
                                <v-autocomplete clearable v-model="quotation.company_id" :items="companyLists" label="Empresa" item-text="name" item-value="id">
                                    <template slot="no-data"><div class="px-4 py-1">No existen empresas relacionadas. <v-btn rounded class="mx-3" color="primary" @click="createCompanyDialog=true" x-small>Crear</v-btn></div></template>                      
                                </v-autocomplete>
                            </v-col>
                            <v-col class="py-0" cols="12" sm="6" md="6">
                                <v-autocomplete :disabled="quotation.company_id==null" clearable v-model="quotation.contact_id" :items="contactLists" label="Contacto" item-text="name" item-value="id">
                                    <template slot="no-data"><div class="px-4 py-1">No existen contactos relacionados. <v-btn rounded class="mx-3" color="primary" @click="createContactDialog=true" x-small>Crear</v-btn></div></template>                      
                                </v-autocomplete>
                            </v-col> 
                            <v-container fluid>
                                <v-textarea v-model="quotation.note" label="Descripcion"></v-textarea>
                            </v-container>
                        </v-row>  
                    </v-col>
                    <v-col class="pb-0 pt-6" cols="12" sm="6" md="7">
                        <v-row style="background-color: #94949417;" class="px-2 ma-0 py-2" v-for="(item,k) in quotation.items" :key="k">
                          <v-col cols="2" class="py-0 my-0">
                              <v-text-field type=number v-model="item.quantity" label="Cantidad"></v-text-field>
                          </v-col>
                          <v-col cols="6" class="py-0 my-0">
                              <v-select :items="itemLists" v-model="item.item" item-text="name" item-value="id" label="Producto"></v-select>
                          </v-col>
                          <v-col cols="3" class="py-0 my-0" v-if="item.item!=''">
                              <v-text-field v-model="item.value" prefix="$" suffix="c/u" label="Valor"></v-text-field>
                          </v-col>
                          <v-col cols="1">
                              <v-icon @click="remove(k)" v-show="k || ( !k && quotation.items.length > 1)" color="red">mdi-close</v-icon>
                              <v-icon @click="add(k)" v-show="k == quotation.items.length-1" color="primary">mdi-plus</v-icon>
                          </v-col>
                        </v-row>
                        <v-row class="mt-1 px-6">
                            <v-col class="pt-8" cols="12" sm="6" md="6">
                                <!--strong>Total = {{totalQuotation.toLocaleString('es-MX', { style: 'currency', currency: 'MXN',})}}</strong-->
                            </v-col>
                            <v-col cols="12" sm="6" md="6">
                                <v-text-field v-if="quotation.amount=totalQuotation" v-model="quotation.amount" prefix="$" label="Monto en Pesos"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
            </v-container>
        </v-card-text>
        <v-card-actions>
            <v-menu top offset-x>
                <template v-slot:activator="{ on, attrs }">
                    <v-btn style="font-size:12px;" text v-bind="attrs" v-on="on">
                        <v-icon class="mr-2">mdi-attachment</v-icon> Adjuntar archivo
                    </v-btn>
                </template>
                <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" :useCustomSlot="true" v-on:vdropzone-success="uploadSuccess" v-on:vdropzone-error="uploadError" v-on:vdropzone-removed-file="fileRemoved"/>
            </v-menu>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">
                Cancelar
            </v-btn>
            <v-btn color="blue darken-1" text @click="save" :disabled="gris" :loading="gris">
                Guardar
            </v-btn>
        </v-card-actions>

        <!-- Crear Contacto -->
        <v-dialog v-model="createContactDialog" max-width="600px">
            <createContact v-bind:company="quotation.company_id" @closeCreateDialogContact="closeCreateDialogContact"/>
        </v-dialog>
        <!-- Crear empresa -->
        <v-dialog v-model="createCompanyDialog" max-width="700px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn bottom color="#e74919" dark fab fixed right v-bind="attrs" v-on="on">
                <v-icon color="white">  mdi-plus </v-icon>
            </v-btn> 
          </template>
          <createCompany @closeCreateDialogCompany="closeCreateDialogCompany"/>
        </v-dialog>

    </v-card>
</template>

<script>
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import CreateContact from "../clients/contacts/create"
import CreateCompany from "../clients/companies/create"
import axios from "axios";
    export default {
        props:{
            company:String
        },
        components: {
            vueDropzone: vue2Dropzone,
            'createContact':CreateContact,
            'createCompany':CreateCompany,
        },   
        data: () => ({
            gris:false,
            createContactDialog: false,
            createCompanyDialog: false,
            dropzoneOptions: {
                url: "https://backendduramax.unocrm.mx/api/v1/quotation/files/"+'hola',
                addRemoveLinks: true,
                maxFiles: 1
            },
            quotation:{
                company_id:null,
                contact_id:'',
                user_id:'',
                amount:'',
                pdf:'',
                note:'',
                items:[{
                    quantity:1,
                    item:'',
                    value:''
                }],
                status:'quotation'
            },
            rules: {
                required: value => !!value || 'Campo requerido',
            },
            valid: true,
        }),
    computed: {
        companyLists(){
            return this.$store.state.company.companies;
        },
        contactLists(){
            if(this.quotation.company_id!=null){
                return this.$store.state.contact.contacts.filter(contact=>contact.company_id == this.quotation.company_id);
            }
        }, 
        usersLists(){
            return this.$store.state.user.users;
        }, 
        itemLists(){
            return this.$store.state.item.items;
        },
        totalQuotation(){
            var total=0
            if(this.quotation.items.length!=0){
            for(var i=0; i<this.quotation.items.length; i++){
                total = total+(this.quotation.items[i].value*this.quotation.items[i].quantity)
            }
            return total
            }
        }, 
        currentUser:{
            get(){
                return this.$store.state.currentUser.user
            }
        }    
    },
    created(){
        if(this.company!=undefined){
            this.quotation.company_id=Number(this.company)
        }
        
    },
    watch: {
    
    },
    methods: {
        permissions(permission){
            if(this.currentUser.id==1){
                return true
            }else if(this.currentUser.permissions!=undefined){
                if(this.currentUser.permissions.includes(permission)){
                    return true
                }else{
                    return false
                }
            }else {
                return false
            }
        },
        uploadSuccess(file, response) {
            console.log('File Successfully Uploaded with file name: ' + response.file);
            this.fileName = response.file;
            this.quotation.pdf = this.fileName;
        },
        uploadError(file, message) {
            console.log('An Error Occurred');
        },
        fileRemoved() {
            
        },
        sugestedValue(id) {
            return this.itemLists.filter(item => item.id == id).map(item => item.price)[0];
        },
        add(index) {
            this.quotation.items.push({ quantity: 1, item: '', value:'' });
        },
        remove(index) {
            this.quotation.items.splice(index, 1);
        },
        close () {
            this.quotation = Object.assign({}, this.defaultItem)
            this.quotation.company_id=null
            this.quotation.status='quotation'
            this.quotation.items=[{
                quantity:1,
                item:'',
                value:''
            }]
            if(this.company!=undefined){
                this.quotation.company_id=Number(this.company)
            }
            this.$nextTick(() => {
                this.$emit("closeCreateDialogQuotation", false);
            })
        },
        save(){
            this.gris = true
            axios.post("https://backendduramax.unocrm.mx/api/v1/quotation/create",Object.assign(this.quotation)).then(response=>{
                this.close()
                this.gris = false
            })
        },
        closeCreateDialogContact: function(params) {
            this.createContactDialog = params;
            this.$store.dispatch('contact/getContacts')
        },
        closeCreateDialogCompany: function(params) {
            this.createCompanyDialog = params;
            this.$store.dispatch('company/getCompanies')
        },
    },
}
</script>
<style lang="css" scoped>
.v-text-field >>> label{
    font-size: 14px!important;
}
</style>
<style>
.v-input__icon--prepend-inner i::before {
    font-size: 18px!important;
    color:#1976D2;
}
.v-text-field input, .v-label {
    font-size: 14px;
}
.v-picker__title.primary{
    display:none;
}
</style>