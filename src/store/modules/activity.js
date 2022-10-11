import axios from "axios";
const state = {
    activities:[]
};
const getters = {};

const actions = {
    getActivities( {commit} ){
        axios
        .get("https://backendduramax.unocrm.mx/api/v1/activity/all")
        .then(response => {
            commit('setActivities', response.data);
        });
    }
};

const mutations = {
    setActivities(state, data){
        state.activities = data;
    }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}