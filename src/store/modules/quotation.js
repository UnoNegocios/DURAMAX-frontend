import axios from "axios";
const state = {
    quotations:[],
    cancellations:[],
    sales:[]
};
const getters = {};

const actions = {
    getQuotations( {commit} ){
        axios
        .get("https://backendduramax.unocrm.mx/api/v1/quotation/all")
        .then(response => {
            commit('setQuotations', response.data);
        });
    },
    getSales( {commit} ){
        axios
        .get("https://backendduramax.unocrm.mx/api/v1/quotation/all")
        .then(response => {
            commit('setSales', response.data);
        });
    },
    getCancellations( {commit} ){
        axios
        .get("https://backendduramax.unocrm.mx/api/v1/quotation/all")
        .then(response => {
            commit('setCancellations', response.data);
        });
    },
};

const mutations = {
    setQuotations(state, data){
        state.quotations = data;
    },
    setCancellations(state, data){
        state.cancellations = data;
    },
    setSales(state, data){
        state.sales = data;
    },
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}