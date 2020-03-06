/**
 * Users Module
 */
import Vue from 'vue'
import Nprogress from 'nprogress';
import router from '../../../router';

const state = {
  users: null
}

const getters = {
  userById: state => id => {
    let user = state.users.find(user => user.id === Number(id));
    return user
  },
  getUsers: state => {
    return state.users
  }
}

const actions = {
  async getUser(context, payload) {
    let user = {},
      userId = payload.userId,
      token = payload.token;

    try {
      let response = await Vue.axios.get(`${process.env.VUE_APP_SOURC_URL}/users/${userId}?access_token=${token}`)
      return user = response;

    } catch (error) {
      // statements
      user = error.response
      return user;
    }
  },
  updateUser(context, payload) {
    // local data
    let user = Vue._.omit(payload, 'details'),
      userId = localStorage.getItem('userId'),
      token = localStorage.getItem('userSecret');

    context.dispatch('getUser', {
      userId,
      token
    }).then(response => {

      // data from the server
      let remoteData = response,
        postingData = {},
        postingStatus = false;

      Vue._.forIn(user, function (value, key) {
        if (user[key] !== remoteData[key]) {
          postingStatus = true;
          postingData[key] = value;
        }

      })

      // if posting status is true
      if (postingStatus) {
        return Vue.axios.patch(`${process.env.VUE_APP_SOURC_URL}/users/${userId}?access_token=${token}`, postingData).then(response => {
          return response;
        }).catch(error => {
          return error;
        })
      }
    })

  },
  async getUsers(context, payload) {
    let users,
      userDetails,
      userId = localStorage.getItem('userId'),
      token = localStorage.getItem('userSecret');

    try {

      users = await Vue.axios.get(`${process.env.VUE_APP_SOURC_URL}/users/?access_token=${token}`);

      for (let [key, obj] of users.data.entries()) {

        userDetails = await context.dispatch('getUserDetails', {
          userId: users.data[key].id,
          type: 'object'
        })
        // let userDetails = await Vue.axios.get(`${process.env.VUE_APP_SOURC_URL}/users/${users.data[key].id}/details/?access_token=${token}`)

        if (!Vue._.isEmpty(userDetails.data)) {

          users.data[key]['details'] = userDetails.data

        }
      }

      context.commit('usersSuccess', users.data);
      return users.data;

    } catch (error) {

      context.commit('usersFailure');

      users = error.response
      return users;

    }
  },
  async getUserDetails(context, payload) {
    let response,
      usersDetails = {},
      userId = payload.userId,
      token = payload.token?payload.token:localStorage.getItem('userSecret'),
      type = payload.type;

    try {
      response = await Vue.axios.get(`${process.env.VUE_APP_SOURC_URL}/users/${userId}/details/?access_token=${token}`);

      // returned value is an object
      if (type === 'object') {

        // set the userDetails object
        usersDetails = Vue._.omit(response, 'data')
        usersDetails.data = {}

        // loop through user details array
        Vue._.forEach(response.data, function (object, key) {
          let objectProperty = Vue._.pick(object, ['metaKey', 'metaValue'])

          // create userDetails object
          usersDetails.data[objectProperty.metaKey] = objectProperty.metaValue
        })

        return usersDetails; // Let the calling function know that http is done. You may send some data back

      } else {

        // return value as an array
        usersDetails = response

        return usersDetails; // Let the calling function know that http is done. You may send some data back
      }

      // console.log(usersDetails)
    } catch (error) {
      response = error.response
      return response;
    }

  },
  async updateUserDetails(context, payload) {
    // local data
    let user = Vue._.omit(payload, 'details'),
      userDetails = payload.details,
      userId = localStorage.getItem('userId'),
      token = localStorage.getItem('userSecret');

    Nprogress.start();
    try {

      // get the current user from the server
      let getUser = await context.dispatch('getUser', {
        userId,
        token
      });

      if (!Vue._.isEqual(user, getUser.data)) {
        context.dispatch('updateUser', user)
      }

      try {

        let getUserDetails = await context.dispatch('getUserDetails', {
          userId,
          token
        });

        let remoteData = getUserDetails.data,
          postingData = {};

        // loop through user details array
        Vue._.forIn(userDetails, async function (value, key) {

          // if server data key matches a metaKey
          if (Vue._.some(remoteData, {
              metaKey: key
            })) {

            // set the object with matching key to currentObject
            let currentObject = Vue._.find(remoteData, {
              metaKey: key
            });

            // if the local and server keys value does not match update it
            if (userDetails[key] !== currentObject.metaValue) {

              postingData = {
                "metaId": currentObject.metaId,
                "userId": userId,
                "metaKey": currentObject.metaKey,
                "metaValue": userDetails[currentObject.metaKey]
              }

            } // else do nothing

            // else server data metaKey does not match
          } else {

            postingData = {
              "userId": userId,
              "metaKey": key,
              "metaValue": value
            }
          }

          console.log(postingData)

          try {

            let updateUserDetails = await Vue.axios.put(`${process.env.VUE_APP_SOURC_URL}/userDetails/?access_token=${token}`, postingData)

            console.log(updateUserDetails)

          } catch (error) {

            console.log(error);
          }

        });

        Nprogress.done();

      } catch (error) {
        console.log(error)
      }

    } catch (error) {
      console.log(error)
    }
  },
  async getUserMetaData(context, payload){
    let userId = localStorage.getItem('userId');
    let token = localStorage.getItem('userSecret');
    let key = payload.key;
    let metaData = null;

    const conditions = {
      where:{
        metaKey:key
      }
    }
    try {
      let response = await Vue.axios.get(`${process.env.VUE_APP_SOURC_URL}/users/${userId}/details?filter=${JSON.stringify(conditions)}&access_token=${token}`);
      if(response.data.length>0){
        metaData = response.data[0];
        return metaData;
      }
      return metaData;
    } catch(error){
      let response = error.response
      return response;
    }
  },
  async updateUserMetaData(context, payload){
    let userId = localStorage.getItem('userId');
    let token = localStorage.getItem('userSecret');
    const detailData = payload;

    try {
      let response = await Vue.axios.put(`${process.env.VUE_APP_SOURC_URL}/userDetails?access_token=${token}`, detailData);
      return response.data;
    }catch(error){
      let response = error.response;
      return response
    }
  },
  async postUserMetaData(context, payload){
    let userId = localStorage.getItem('userId');
    let token = localStorage.getItem('userSecret');
    let detailData = {
      metaKey: payload.key,
      metaValue: payload.value,
    };

    try{
      let response = await Vue.axios.post(`${process.env.VUE_APP_SOURC_URL}/users/${userId}/details?access_token=${token}`, detailData);
      return response;
    }catch(error){
      let response = error.response;
      return response;
    }

  }
}

const mutations = {
  users(state) {
    Nprogress.start();
  },
  usersSuccess(state, payload) {
    state.users = payload
    Nprogress.done();
  },
  usersFailure(state, error) {
    Nprogress.done();
    Vue.notify({
      group: 'loggedIn',
      type: 'error',
      title: 'Error:',
      text: 'cannot get users'
    });
  },

}

export default {
  state,
  getters,
  actions,
  mutations
}
