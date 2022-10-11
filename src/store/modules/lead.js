import axios from "axios";
const state = {
    leads:[]
};
const getters = {};

const actions = {
  getLeads( {commit} ){
    axios
    .get("https://backendduramax.unocrm.mx/api/v1/lead/all")
    .then(response => {
        commit('setLeads', response.data);
    });
  }
};

const mutations = {
  setLeads(state, data){
    state.leads = data;
  }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}