<template>
    <div class="padding1" style="background:#f4f5fa;">
        <v-card v-if="info==true" style="background:transparent;" class="elevation-0 pb-6 px-7">
            <v-card-text class="py-3 px-6" style="background:#1976d1; color:white; border-radius: 5px;">
                <v-icon color="white" small class="mr-2">mdi-information-outline</v-icon>
                Lorem ipsum dolor sit amet consectetur adipiscing elit massa imperdiet, mauris tortor platea fringilla sodales ac magna sociosqu, natoque non rutrum nec auctor vestibulum congue eget. 
                <v-icon style="position:absolute!important; top:7px; right:30px;" color="white" @click="info=false" small class="mr-2">mdi-close</v-icon>
            </v-card-text>
        </v-card>
        <!-- Statuses -->
        <v-card style="background:transparent;" class="elevation-0 pb-4 padding2">
            <v-card-title style="background:white;">Estatus 
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small class="ml-4">mdi-information-outline</v-icon>
                    </template>
                    <span>Right tooltip</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-text-field v-if="dialogStatus==true" label="Nombre del Estatus"></v-text-field>                
                <v-btn @click="dialogStatus=true" class="elevation-0" style="height:30px; font-size:13px; font-weight: 400; text-transform:capitalize; color: #1976d1; background-color: rgb(25 118 209 / 10%)!important;" color="primary" dark>Agregar Nuevo</v-btn>
            </v-card-title>
            <statuses class="px-6"/>
            <v-dialog v-model="dialogStatus" max-width="600px">
                <createStatus @closeDialogStatus="closeDialogStatus"/>
            </v-dialog> 
        </v-card>
        <!-- Etapas -->
        <v-card style="background:transparent;" class="elevation-0 py-4 padding2">
            <v-card-title style="background:white;">Etapas 
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small class="ml-4">mdi-information-outline</v-icon>
                    </template>
                    <span>Right tooltip</span>
                </v-tooltip>
                <v-spacer></v-spacer>              
                <v-btn @click="dialogPhase=true" class="elevation-0" style="height:30px; font-size:13px; font-weight: 400; text-transform:capitalize; color: #1976d1; background-color: rgb(25 118 209 / 10%)!important;" color="primary" dark>Agregar Nuevo</v-btn>
            </v-card-title>
            <phases class="px-6"/>
            <v-dialog v-model="dialogPhase" max-width="600px">
                <createPhases @closeDialogPhase="closeDialogPhase"/>
            </v-dialog> 
        </v-card>
        <!-- Origins -->
        <v-card style="background:transparent;" class="elevation-0 py-4 padding2">
            <v-card-title style="background:white;">Procedencias
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small class="ml-4">mdi-information-outline</v-icon>
                    </template>
                    <span>Right tooltip</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-btn @click="dialogOrigin=true" class="elevation-0" style="height:30px; font-size:13px; font-weight: 400; text-transform:capitalize; color: #1976d1; background-color: rgb(25 118 209 / 10%)!important;" color="primary" dark>Agregar Nueva</v-btn>
            </v-card-title>
            <origins class="px-6"/>
            <v-dialog v-model="dialogOrigin" max-width="600px">
                <createOrigins @closeDialogOrigin="closeDialogOrigin"/>
            </v-dialog> 
        </v-card>
        <!-- Types -->
        <v-card style="background:transparent;" class="elevation-0 py-4 padding2">
            <v-card-title style="background:white;">Tipos de Actividad
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small class="ml-4">mdi-information-outline</v-icon>
                    </template>
                    <span>Right tooltip</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-btn @click="dialogType=true" class="elevation-0" style="height:30px; font-size:13px; font-weight: 400; text-transform:capitalize; color: #1976d1; background-color: rgb(25 118 209 / 10%)!important;" color="primary" dark>Agregar Nuevo</v-btn>
            </v-card-title>
            <types class="px-6"/>
            <v-dialog v-model="dialogType" max-width="350px">
                <createTypes @closeDialogType="closeDialogType"/>
            </v-dialog> 
        </v-card>
        <!-- Rejections -->
        <v-card style="background:transparent;" class="elevation-0 py-4 padding2">
            <v-card-title style="background:white;">Motivos de Rechazo
                <v-tooltip right>
                    <template v-slot:activator="{ on, attrs }">
                        <v-icon v-bind="attrs" v-on="on" small class="ml-4">mdi-information-outline</v-icon>
                    </template>
                    <span>Right tooltip</span>
                </v-tooltip>
                <v-spacer></v-spacer>
                <v-btn  @click="dialogRejection=true" class="elevation-0" style="height:30px; font-size:13px; font-weight: 400; text-transform:capitalize; color: #1976d1; background-color: rgb(25 118 209 / 10%)!important;" color="primary" dark>Agregar Nuevo</v-btn>
            </v-card-title>
            <rejections class="px-6"/>
            <v-dialog v-model="dialogRejection" max-width="350px">
                <createRejections @closeDialogRejection="closeDialogRejection"/>
            </v-dialog> 
        </v-card>
    </div>
</template>

<script>
    //containers
    import Statuses from "../catalogs/statuses/table"
    import Phases from "../catalogs/phases/table"
    import Origins from "../catalogs/origins/table"
    import Rejections from "../catalogs/rejections/table"
    import Types from "../catalogs/types/table"
    //creadores
    import createStatus from "../catalogs/statuses/create"
    import createPhases from "../catalogs/phases/create"
    import createOrigins from "../catalogs/origins/create"
    import createRejections from "../catalogs/rejections/create"
    import createTypes from "../catalogs/types/create"
    export default {
        components: {
            //tables
            'statuses':Statuses,
            'phases':Phases,
            'origins':Origins,
            'types':Types,
            'rejections':Rejections,
            //dialogs
            'createStatus':createStatus,
            'createPhases':createPhases,
            'createOrigins':createOrigins,
            'createRejections':createRejections,
            'createTypes':createTypes,
        }, 
        data () {
            return {
                info:true,
                dialogPhase:false,
                dialogOrigin:false,
                dialogType:false,
                dialogRejection:false,
                dialogStatus:false,
            }
        },
        methods:{
            closeDialogPhase: function(params) {
                this.dialogPhase = params;
                this.$store.dispatch('phase/getPhases')
            },
            closeDialogType: function(params) {
                this.dialogType = params;
                this.$store.dispatch('activity/getActivities')
            },
            closeDialogStatus: function(params) {
                this.dialogStatus = params;
                this.$store.dispatch('status/getStatuses')
            },
            closeDialogOrigin: function(params) {
                this.dialogOrigin = params;
                this.$store.dispatch('origin/getOrigins')
            },
            closeDialogRejection: function(params) {
                this.dialogRejection = params;
                this.$store.dispatch('rejection/getRejections')
            },
        }
    }
</script>

<style>
@media (min-width: 980px){
    .padding1{
        padding-left: 24px !important;
        padding-right: 48px !important;
    }
    .padding2{
        padding-right: 28px !important;
        padding-left: 28px !important;
    }
}
@media (max-width: 980px){
    .padding1{
        padding-top:20px!important;
    }
}
</style>