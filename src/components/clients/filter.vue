<template>
    <v-container class="ma-0 pa-0">
        <v-row class="py-10 px-8">
            <strong>Filtros</strong>

            <v-select @keydown.enter="filter()" v-model="company.semaforo" :items="semaforos" item-text="name" item-value="id" attach chips label="Semaforo" multiple>
            </v-select>

            <div class="mt-4">
                Fecha de creación 
                <v-menu v-model="menuFrom" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                    <template v-slot:activator="{ on }">
                        <v-text-field @keydown.enter="filter()" v-model="company.dateCreateFrom" label="Desde" clearable prepend-icon="mdi-calendar-today" readonly v-on="on"></v-text-field>
                    </template>
                    <v-date-picker color="primary" v-model="company.dateCreateFrom" @input="menuFrom = false"></v-date-picker>
                </v-menu>
                <v-menu v-model="menuTo" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                    <template v-slot:activator="{ on }">
                        <v-text-field @keydown.enter="filter()" v-model="company.dateCreateTo" label="Hasta" clearable prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                    </template>
                    <v-date-picker color="primary" v-model="company.dateCreateTo" @input="menuTo = false"></v-date-picker>
                </v-menu>
            </div>

            <v-text-field @keydown.enter="filter()" v-model="company.name" label="Nombre"></v-text-field>
            <v-text-field @keydown.enter="filter()" v-model="company.address" label="Dirección"></v-text-field>
            <v-text-field @keydown.enter="filter()" v-model="company.phone" label="Teléfono"></v-text-field>
            <v-text-field @keydown.enter="filter()" v-model="company.email" label="Correo Electrónico"></v-text-field>
            <v-text-field @keydown.enter="filter()" v-model="company.rfc" label="RFC"></v-text-field>
            <v-text-field @keydown.enter="filter()" v-model="company.razon_social" label="Razón Social"></v-text-field>

            <v-select @keydown.enter="filter()" v-model="company.origins" :items="originLists" item-text="name" item-value="id" attach chips label="Procedencia" multiple>
            </v-select>
            
            <v-select @keydown.enter="filter()" v-model="company.phases" :items="phaseLists" item-text="name" item-value="id" attach chips label="Etapa" multiple>
            </v-select>

            <v-select @keydown.enter="filter()" v-model="company.statuses" :items="statusLists" item-text="name" item-value="id" attach chips label="Estatus" multiple>
            </v-select>

            <v-select @keydown.enter="filter()" v-model="company.users" :items="usersLists" item-text="name" item-value="id" attach chips label="Responsable" multiple>
            </v-select>

            <div class="mt-4">
                Última Actualización 
                <v-menu v-model="menuFrom2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                    <template v-slot:activator="{ on }">
                        <v-text-field @keydown.enter="filter()" v-model="company.dateUpdateFrom" label="Desde" clearable prepend-icon="mdi-calendar-today" readonly v-on="on"></v-text-field>
                    </template>
                    <v-date-picker color="primary" v-model="company.dateUpdateFrom" @input="menuFrom2 = false"></v-date-picker>
                </v-menu>

                <v-menu v-model="menuTo2" :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="290px" >
                    <template v-slot:activator="{ on }">
                        <v-text-field @keydown.enter="filter()" v-model="company.dateUpdateTo" label="Hasta" clearable prepend-icon="mdi-calendar" readonly v-on="on"></v-text-field>
                    </template>
                    <v-date-picker color="primary" v-model="company.dateUpdateTo" @input="menuTo2 = false"></v-date-picker>
                </v-menu>
            </div>

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
        menuTo:false,
        menuTo2:false,
        menuFrom:false,
        menuFrom2:false,
        semaforos:[
            {name: 'verde', id: '#4CAF50',},
            {name: 'amarillo', id: '#FFC107',},
            {name: 'rojo', id: '#FF5252',},
        ],
        company:{
            users:'',
            phases:'',
            origins:'',
            statuses:'',
            name:'',
            address:'',
            phone:'',
            email:'',
            rfc:'',
            razon_social:'',
            dateCreateFrom:'',
            dateCreateTo:'',
            dateUpdateFrom:'',
            dateUpdateTo:'',
            semaforo:''
        },
    }),
    computed: {
        usersLists(){
            return this.$store.state.user.users;
        },
        originLists(){
            return this.$store.state.origin.origins;
        },
        phaseLists(){
            return this.$store.state.phase.phases;
        },
        statusLists(){
            return this.$store.state.status.statuses;
        },
    },
    created () {
        
    },
    methods: {
        filter(){
            this.$emit("filtersCompany", this.company);
        }
    }
  }
</script>