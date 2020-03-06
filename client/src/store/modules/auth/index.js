/**
 * Auth Module
 */
import Vue from 'vue'
import firebase from 'firebase';
import Nprogress from 'nprogress';
import router from '../../../router';
import {
  facebookAuthProvider,
  googleAuthProvider,
  twitterAuthProvider,
  githubAuthProvider
} from '../../../firebase';

const state = {
  user: {},
  isUserSigninWithAuth0: Boolean(localStorage.getItem('isUserSigninWithAuth0'))
}

// getters
const getters = {
  getUser: state => {
    return state.user;
  },
  isUserSigninWithAuth0: state => {
    return state.isUserSigninWithAuth0;
  }
}

// actions
const actions = {
  signUpUserInLoopback(context, payload) {
    const user = payload.userDetails;
    context.commit('signUpUser');
    Vue.axios.post(`${process.env.VUE_APP_SOURC_URL}/users`, user).then(response => {
      Nprogress.done();
      setTimeout(() => {
        context.commit('signUpUserVerify', user);
      }, 500)
    }).catch(error => {
      context.commit('signUpUserFailure', error.response);
    });
  },
  signinUserInLoopback(context, payload) {
    const credentials = payload.userDetails;
    let user = {};

    context.commit('loginUser');

    Vue.axios.post(`${process.env.VUE_APP_SOURC_URL}/users/login`, credentials).then(response => {
      let token = response.data.id
      let userId = response.data.userId

      Nprogress.done();
      setTimeout(() => {
        context.dispatch('getUser', {
          userId,
          token
        }).then(response => {

          // set user to response
          user = response

          context.dispatch('getUserDetails', {
            userId,
            token,
            type: 'object'
          }).then(response => {

            // set user details to response
            user.details = response.data

            // getUserDetails dsipatch succeded
            context.commit('loginUserSuccess', {
              user,
              userId,
              token
            });

          }).catch(error => {

            // getUserDetails dsipatch failed
            context.commit('loginUserFailure', error.response);

          })

        }).catch(error => {

          // getUser dsipatch failed
          context.commit('loginUserFailure', error.response);

        })

      }, 1000)
    }).catch(error => {
      context.commit('loginUserFailure', error.response);
    });
  },
  logoutUserFromLoopback(context) {
    Nprogress.start();
    let token = localStorage.getItem('userSecret')
    Vue.axios.post(`${process.env.VUE_APP_SOURC_URL}/users/logout?access_token=${token}`).then(response => {
      Nprogress.done();
      setTimeout(() => {
        context.commit('logoutUser');
      }, 500)
    }).catch(error => {
      // console.log(error.response)
    })
  },
  resetUserInLoopback(context, payload) {
    Nprogress.start();
    const user = payload.userDetails
    Vue.axios.post(`${process.env.VUE_APP_SOURC_URL}/users/reset`, user).then(response => {
      Nprogress.done();
      setTimeout(() => {
        context.commit('resetUserPassword', user);
      }, 500)
    }).catch(error => {
      console.log(error)
    })
  },
  resetUserPasswordInLoopback(context, payload) {
    Nprogress.start();
    const token = payload.userDetails.token
    const password = {
      newPassword: payload.userDetails.newPassword
    }
    Vue.axios.post(`${process.env.VUE_APP_SOURC_URL}/users/reset-password/?access_token=${token}`, password).then(response => {
      Nprogress.done();
      setTimeout(() => {
        context.commit('resetUserPasswordSuccess');
      }, 500)
    }).catch(error => {
      console.log(error)
    })
  },
  async checkUserAuth(context, payload) {

    let user = {},
      userId = localStorage.getItem('userId'),
      token = localStorage.getItem('userSecret');

    context.commit('userData');

    let getUser = await context.dispatch('getUser', {
      userId,
      token
    })

    if (getUser.status === 200) {

      let getUserDetails = await context.dispatch('getUserDetails', {
        userId,
        token,
        type: 'object'
      })

      if (getUserDetails.status === 200) {

        user = getUser.data
        user.details = getUserDetails.data

        context.commit('userDataSuccess', user);

        return true;

      } else {

        context.commit('userDataFailure', getUser.response);

        return false;
      }

    } else {

      context.commit('userDataFailure', getUser.response);

      return false;

    }
  }
  // signinUserWithFacebook(context) {
  //     context.commit('loginUser');
  //     firebase.auth().signInWithPopup(facebookAuthProvider).then((result) => {
  //         Nprogress.done();
  //         setTimeout(() => {
  //             context.commit('loginUserSuccess', result.user);
  //         }, 500)
  //     }).catch(error => {
  //         context.commit('loginUserFailure', error);
  //     });
  // },
  // signinUserWithGoogle(context) {
  //     context.commit('loginUser');
  //     firebase.auth().signInWithPopup(googleAuthProvider).then((result) => {
  //         Nprogress.done();
  //         setTimeout(() => {
  //             context.commit('loginUserSuccess', result.user);
  //         }, 500)
  //     }).catch(error => {
  //         context.commit('loginUserFailure', error);
  //     });
  // },
  // signinUserWithTwitter(context) {
  //     context.commit('loginUser');
  //     firebase.auth().signInWithPopup(twitterAuthProvider).then((result) => {
  //         Nprogress.done();
  //         setTimeout(() => {
  //             context.commit('loginUserSuccess', result.user);
  //         }, 500)
  //     }).catch(error => {
  //         context.commit('loginUserFailure', error);
  //     });
  // },
  // signinUserWithGithub(context) {
  //     context.commit('loginUser');
  //     firebase.auth().signInWithPopup(githubAuthProvider).then((result) => {
  //         Nprogress.done();
  //         setTimeout(() => {
  //             context.commit('loginUserSuccess', result.user);
  //         }, 500)
  //     }).catch(error => {
  //         context.commit('loginUserFailure', error);
  //     });
  // },
  // signupUserInFirebase(context, payload) {
  //     let { userDetail } = payload;
  //     context.commit('signUpUser');
  //     firebase.auth().createUserWithEmailAndPassword(userDetail.email, userDetail.password)
  //         .then(() => {
  //             Nprogress.done();
  //             setTimeout(() => {
  //                 context.commit('signUpUserSuccess', userDetail);
  //             }, 500)
  //         })
  //         .catch(error => {
  //             context.commit('signUpUserFailure', error);
  //         })
  // },
  // signInUserWithAuth0(context, payload) {
  //     context.commit('signInUserWithAuth0Success', payload);
  // },
  // signOutUserFromAuth0(context) {
  //     context.commit('signOutUserFromAuth0Success');
  // }
}

// mutations
const mutations = {
  userData(state) {
    Nprogress.start();
  },
  userDataSuccess(state, user) {
    state.user = user;
    Nprogress.done();
  },
  userDataFailure(state, error) {
    Nprogress.done();
    Vue.notify({
      group: 'loggedIn',
      type: 'error',
      title: 'Error:',
      text: 'cannot get users data'
    });
  },
  loginUser(state) {
    Nprogress.start();
  },
  loginUserSuccess(state, {
    user,
    userId,
    token
  }) {
    // set user credentials to state
    state.user = user;
    localStorage.setItem('userSecret', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('phoneNumber', user.details.phoneNumber);
    localStorage.setItem('availableCall', user.details.availableCall);
    state.isUserSigninWithAuth0 = false

    router.push("/dashboard/");
    setTimeout(function () {
      Vue.notify({
        group: 'loggedIn',
        type: 'success',
        title: 'Success:',
        text: 'user logged in successfully!'
      });
    }, 1500);
  },
  loginUserFailure(state, error) {
    Nprogress.done();
    Vue.notify({
      group: 'loggedIn',
      type: 'error',
      title: 'Error:',
      text: error.data.error.message
    });
  },
  logoutUser(state) {
    state.user = null
    localStorage.removeItem('userSecret');
    localStorage.removeItem('phoneNumber');
    localStorage.removeItem('availableCall');
    router.push("/session/login");
  },
  signUpUser(state) {
    Nprogress.start();
  },
  signUpUserVerify(state, user) {
    console.log(user.email)
    Vue.notify({
      group: 'loggedIn',
      type: 'success',
      title: 'Success:',
      text: `we sent a verification link to: ${user.email}`
    });
  },
  signUpUserSuccess(state, user) {
    // state.user = localStorage.setItem('user', user);
    // router.push("/default/dashboard/ecommerce");
    Vue.notify({
      group: 'loggedIn',
      type: 'success',
      title: 'Success:',
      text: 'account successfully verified! please login.'
    });
  },
  resetUserPassword(state, user) {
    router.push("/session/login")
    Vue.notify({
      group: 'loggedIn',
      type: 'success',
      title: 'Success:',
      text: `an email with a link to reset your password has been sent to: ${user.email}`
    });
  },
  resetUserPasswordSuccess(state, user) {
    router.push("/session/login")
    Vue.notify({
      group: 'loggedIn',
      type: 'success',
      title: 'Success:',
      text: `password successfully reset! please login.`
    });
  },
  signUpUserFailure(state, error) {
    Nprogress.done();
    Vue.notify({
      group: 'loggedIn',
      type: 'error',
      title: 'Error:',
      text: error.data.error.message
    });
  },
  signInUserWithAuth0Success(state, user) {
    state.user = user;
    localStorage.setItem('user', JSON.stringify(user));
    state.isUserSigninWithAuth0 = true;
  },
  signOutUserFromAuth0Success(state) {
    state.user = null
    localStorage.removeItem('user')
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
