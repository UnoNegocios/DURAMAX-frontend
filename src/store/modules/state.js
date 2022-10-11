import axios from "axios";
const state = {
    states:[]
};
const getters = {};

const actions = {
    getStates( {commit} ){
        axios
        .get("https://backendduramax.unocrm.mx/api/v1/state/all")
        .then(response => {
            commit('setStates', response.data);
        });
    }
};

const mutations = {
    setStates(state, data){
        state.states = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}