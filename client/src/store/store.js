import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VueAxios from 'vue-axios'

// modules
import contacts from './modules/contacts';
import users from './modules/users';
import auth from './modules/auth';
import chat from './modules/chat';
import settings from './modules/settings';
import ecommerce from './modules/ecommerce';
import mail from './modules/mail';
import sidebar from './modules/sidebar';
import stats from './modules/stats';
import site from './modules/site';
import dialer from './modules/dialer';

Vue.use(Vuex);
Vue.use(VueAxios, axios);

export const store = new Vuex.Store({
  modules: {
    auth,
    chat,
    settings,
    ecommerce,
    mail,
    sidebar,
    contacts,
    users,
    stats,
    site,
    dialer
  }
})
