import Vue from 'vue'
import Vuex from 'vuex'

import currentUser from "./modules/currentUser"
import item from "./modules/item"
import rejection from "./modules/rejection"
import quotation from "./modules/quotation"
import phase from "./modules/phase"
import origin from "./modules/origin"
import note from "./modules/note"
import log from "./modules/log"
import contact from "./modules/contact"
import company from "./modules/company"
import lead from "./modules/lead"
import calendar from "./modules/calendar"
import activity from "./modules/activity"
import user from "./modules/user"
import status from "./modules/status"
import category from "./modules/category"
import pp from "./modules/pp"

import state from "./modules/state"
import city from "./modules/city"

import goal from "./modules/goal"

Vue.use(Vuex)

export default new Vuex.Store({
  //state: {},
  mutations: {
  },
  actions: {
  },
  modules: {
    goal,
    lead,
    state,
    city,
    currentUser,
    item,
    rejection,
    quotation,
    phase,
    origin,
    note,
    log,
    contact,
    company,
    calendar,
    activity,
    user,
    status,
    category,
    pp
  }
})
