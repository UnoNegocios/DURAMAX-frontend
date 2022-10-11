import axios from "axios";
const state = {
    cities:[]
};
const getters = {};

const actions = {
    getCities( {commit} ){
        axios
        .get("https://backendduramax.unocrm.mx/api/v1/city/all")
        .then(response => {
            commit('setCities', response.data);
        });
    }
};

const mutations = {
    setCities(state, data){
        state.cities = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}