import axios from "axios";
const state = {
    goals:[]
};
const getters = {};

const actions = {
    getGoals( {commit} ){
        axios
        .get("https://backendduramax.unocrm.mx/api/v1/goal/all")
        .then(response => {
            commit('setGoals', response.data);
        });
    }
};

const mutations = {
    setGoals(state, data){
        state.goals = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}