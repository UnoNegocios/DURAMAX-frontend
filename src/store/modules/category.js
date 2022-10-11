import axios from "axios";
const state = {
    categories:[]
};
const getters = {};

const actions = {
  getCategories( {commit} ){
    axios
    .get("https://backendduramax.unocrm.mx/api/v1/category/all")
    .then(response => {
        commit('setCategories', response.data);
    });
  }
};

const mutations = {
  setCategories(state, data){
    state.categories = data;
  }
};

export default{
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}