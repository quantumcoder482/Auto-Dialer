/**
 * Sites Module
 */
import Vue from 'vue'

const state = {
  sites: null
}

const getters = {
  // sites: state => {
  //     return state.sites
  // },
}

const actions = {

  async getSites(context, payload) {
    let sites,
      token = localStorage.getItem('userSecret');

    try {

      sites = await Vue.axios.get(`${process.env.VUE_APP_SOURC_URL}/sites/?access_token=${token}`);
      context.commit('SitesSuccess', sites.data);
      return sites;

    } catch (error) {

      // context.commit('usersFailure');

      sites = error.response
      return sites;

    }
  },

  async addSite(context, payload) {
    let token = localStorage.getItem('userSecret');
    const description = payload.description;
    const siteName = payload.siteName;
    let postAvailable = (payload.userCheck ? '1' : '0') + (payload.contactCheck ? '1' : '0') + (payload.siteCheck ? '1' : '0');
    const apiKey = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const siteId = Math.random().toFixed(36).substring(2, 6);
    let current_datetime = new Date()
    let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds()
    const lastTrigger = formatted_date;
    const new_site = {
      "description": description,
      "siteName": siteName,
      "apiKey": apiKey,
      "siteId": siteId,
      "postAvailable": postAvailable,
      "lastTrigger": lastTrigger
    };
    try {

      await Vue.axios.put(`${process.env.VUE_APP_SOURC_URL}/sites/?access_token=${token}`, new_site)
        .then(function (response) {
          setTimeout(function () {
            Vue.notify({
              group: 'loggedIn',
              type: 'success',
              title: 'Success:',
              text: 'site saved successfully!'
            });
          }, 500);
        }).catch(function (error) {
          setTimeout(function () {
            Vue.notify({
              group: 'loggedIn',
              type: 'error',
              title: 'Error:',
              text: 'site saved failed!'
            });
          }, 500);
        });

    } catch (error) {
      console.log(error);
    }
  },

  async removeSite(context, payload) {
    let token = localStorage.getItem('userSecret');
    const remove_id = payload;
    try {
      await Vue.axios.delete(`${process.env.VUE_APP_SOURC_URL}/sites/${remove_id}/?access_token=${token}`)
        .then(function (response) {
          context.commit('SitesRemove', remove_id);
          setTimeout(function () {
            Vue.notify({
              group: 'loggedIn',
              type: 'success',
              title: 'Success:',
              text: 'site removed successfully!'
            });
          }, 500);
        }).catch(function (error) {
          setTimeout(function () {
            Vue.notify({
              group: 'loggedIn',
              type: 'error',
              title: 'Error:',
              text: 'site removed failed!'
            });
          }, 500);
        });

    } catch (error) {
      console.log(error);
    }
  },

  async updateSite(context, payload) {
    let token = localStorage.getItem('userSecret');
    let id = payload.id;
    let current_datetime = new Date();
    let postAvailable = (payload.userCheck ? '1' : '0') + (payload.contactCheck ? '1' : '0') + (payload.siteCheck ? '1' : '0');
    let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds()
    const lastTrigger = formatted_date;
    const new_site = {
      "description": payload.description,
      "siteName": payload.siteName,
      "apiKey": payload.apiKey,
      "siteId": payload.siteId,
      "postAvailable": postAvailable,
      "lastTrigger": lastTrigger
    };
    try {
      await Vue.axios.patch(`${process.env.VUE_APP_SOURC_URL}/sites/${id}?access_token=${token}`, new_site)
        .then(function (response) {
          setTimeout(function () {
            Vue.notify({
              group: 'loggedIn',
              type: 'success',
              title: 'Success:',
              text: 'site updated successfully!'
            });
          }, 500);
        }).catch(function (error) {
          setTimeout(function () {
            Vue.notify({
              group: 'loggedIn',
              type: 'error',
              title: 'Error:',
              text: 'site updated failed!'
            });
          }, 500);
        });

    } catch (error) {
      console.log(error);
    }
  },

  async removeSiteDetail(context, payload) {
    let token = localStorage.getItem('userSecret');
    const remove_id = payload;
    try {
      let response = await Vue.axios.delete(`${process.env.VUE_APP_SOURC_URL}/sites/${remove_id}/?access_token=${token}`)
      return response;

    } catch (error) {
      console.log(error);
    }
  },

  async getSite(context, payload) {
    let token = localStorage.getItem('userSecret');
    const id = payload;
    try {
      let response = await Vue.axios.get(`${process.env.VUE_APP_SOURC_URL}/sites/${id}/?access_token=${token}`)
      return response;
    } catch (error) {
      console.log(error);
    }
  }
}

const mutations = {
  SitesSuccess(state, sites) {
    state.sites = sites;
  },
  SitesRemove(state, id) {
    let pos = state.sites.map(function (e) {
      return e.id;
    }).indexOf(id);
    state.sites.splice(pos, 1);
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
