<template>
    <v-container class="ma-0 pa-0">
        <v-row class="py-10 px-8">
            <strong>Filtros</strong>

            <v-text-field @keydown.enter="filter()" v-model="lead.name" label="Nombre"></v-text-field>
            <v-text-field @keydown.enter="filter()" v-model="lead.company" label="Empresa"></v-text-field>
            <v-text-field @keydown.enter="filter()" v-model="lead.phone" label="Teléfono"></v-text-field>
            <v-text-field @keydown.enter="filter()" v-model="lead.email" label="Correo Electrónico"></v-text-field>
            <v-text-field @keydown.enter="filter()" v-model="lead.zone" label="Zona"></v-text-field>
            <v-text-field @keydown.enter="filter()" v-model="lead.razon_social" label="Razón Social"></v-text-field>

            <v-select @keydown.enter="filter()" v-model="lead.origins" :items="originLists" item-text="name" item-value="id" attach chips label="Procedencia" multiple>
            </v-select>

            <v-text-field @keydown.enter="filter()" v-model="lead.subject" label="Asunto"></v-text-field>

            <v-select @keydown.enter="filter()" v-model="lead.user_id" :items="usersLists" item-text="name" item-value="id" attach chips label="Responsable" multiple>
            </v-select>

            <v-text-field @keydown.enter="filter()" v-model="lead.comments" label="Comentarios"></v-text-field>

            <v-menu offset-y :close-on-content-click="closeDatePicker(lead.date)">
                <template v-slot:activator="{ on, attrs }">
                    <v-text-field :rules="[v => !!v || 'Campo requerido']" clearable required v-model="lead.date" label="Fecha Envío" prepend-icon="mdi-calendar" v-bind="attrs" readonly v-on="on"></v-text-field>
                </template>
                <v-date-picker v-model="lead.date" range></v-date-picker>
            </v-menu>

        </v-row>

        <v-card style="position:absolute; bottom:0; width:100%;" tile color="primary"><!-- # d71182 -->
                    <v-list-item link @click="filter()" dark>
                        <v-list-item-content>
                            <strong>Filtrar (0)</strong>
                        </v-list-item-content>
                    </v-list-item>    
                </v-card>
    </v-container>
</template>
<script>

  export default {
    data: () => ({
        lead:{
            name:'',
            date:[],
            email:'',
            phone:'',
            zone:'',
            company:[],
            origin_id:'',
            subject:'',
            user_id:'',
            conversion:'',
            comments:''
        },
    }),
    computed: {
        usersLists(){
            return this.$store.state.user.users;
        },
        originLists(){
            return this.$store.state.origin.origins;
        },
    },
    created () {
        
    },
    methods: {
        closeDatePicker(dates){
            if(dates.length==2){
                return true
            }else{
                return false
            }
        },
        filter(){
            this.$emit("filtersLead", this.lead);
        }
    }
  }
</script>