import axios from "axios";
const state = {
    statuses:[]
};
const getters = {};

const actions = {
    getStatuses( {commit} ){
        axios
        .get("https://backendduramax.unocrm.mx/api/v1/status/all")
        .then(response => {
            commit('setStatuses', response.data);
        });
    }
};

const mutations = {
    setStatuses(state, data){
        state.statuses = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}