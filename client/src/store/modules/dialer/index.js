import Vue from 'vue'
import {
  vuexfireMutations,
  firebaseAction
} from 'vuexfire'
import Nprogress from 'nprogress';
import {
  database,
  dialerQueueRef
} from '../../../firebase';
import router from '../../../router';


const state = {
  dialerQueue: [],
  dialerHistories: null,
  dialerSchedules: null,
  dispositions: null,
  dialerTimer: process.env.AUTO_DIALER_TIEMR,
  dialing: false
}

const getters = {
  getDialerHistories: state => {
    return state.dialerHistories;
  },
  getDialerSchedules: state => {
    return state.dialerSchedules;
  },
  getDialerQueue: state => {
    let queueArray = state.dialerQueue;
    return queueArray;
  },
  getDispositions: state => {
    return state.dispositions;
  },
  getDialerTimer: state => {
    return state.dialerTimer;
  }
}


const actions = {
  async getDialerHistories(context, payload) {
    let dialerHistories = null;
    let userId = localStorage.getItem('userId');
    let token = localStorage.getItem('userSecret');

    try {
      let filter = {
        where: {
          userId: userId
        }
      };
      filter = JSON.stringify(filter);

      dialerHistories = await Vue.axios.get(`${process.env.VUE_APP_SOURC_URL}/dialerHistories/?filter=${filter}&access_token=${token}`);

      context.commit('DialerHistoriesSuccess', dialerHistories.data);
      return dialerHistories.data;
    } catch (error) {
      dialerHistories = error.response
      return dialerHistories;
    }
  },
  async getDispositions(context, payload) {
    let dispositions = null;
    let token = localStorage.getItem('userSecret');
    try {
      dispositions = await Vue.axios.get(`${process.env.VUE_APP_SOURC_URL}/dispositionTypes/?access_token=${token}`);
      context.commit('DispositionSuccess', dispositions.data);
      return dispositions.data;
    } catch (error) {
      dispositions = error.response;
      return dispositions;
    }
  },
  async getDialerQueueLoopback(context, payload) {
    let dialerQueueData = null;
    let userId = localStorage.getItem('userId');
    let token = localStorage.getItem('userSecret');
    let dialerQueue = [];
    let dialerSchedule = [];

    try {

      dialerQueueData = await Vue.axios.get(`${process.env.VUE_APP_SOURC_URL}/dialerQueues/?access_token=${token}`);

      await Vue._.forEach(dialerQueueData.data, function (object, key) {
        if (object.assignedId && object.assignedId == userId) {
          dialerSchedule.push(object);
        } else {
          dialerQueue.push(object);
        }
      });

      await context.commit('DialerQueueSuccess', dialerQueue);
      await context.commit('DialerScheduleSuccess', dialerSchedule);
      return dialerQueue.data;

    } catch (error) {
      dialerQueueData = error.response;
      return dialerQueueData;
    }
  },
  async postDialerHistory(context, payload){
    let userId = localStorage.getItem('userId');
    let token = localStorage.getItem('userSecret');

    let postData = {...payload, userId: userId};

    try{
      postHistoryData = await Vue.axios.post(`${process.env.VUE_APP_SOURC_URL}/dialerHistories/?access_token=${token}`, postData);

      return postHistoryData.data;

    } catch( error){
      let response = error.response;
      return response;
    }

  },
  bindDialerQueueRef: firebaseAction(context => {
    return context.bindFirebaseRef('dialerQueue', dialerQueueRef.orderByChild('createdAt'));
  }),
  unbindDialerQueueRefs: firebaseAction(context => {
    return context.unbindFirebaseRef('dialerQueue')
  })

}

const mutations = {
  DialerHistoriesSuccess(state, dialerHistories) {
    // console.log("history", dialerHistories);
    state.dialerHistories = dialerHistories;
  },
  DialerQueueSuccess(state, dialerQueue) {
    // console.log("queue", dialerQueue);
    state.dialerQueue = dialerQueue;
  },
  DialerScheduleSuccess(state, dialerSchedules) {
    // console.log("schedule", dialerSchedules);
    state.dialerSchedules = dialerSchedules;
  },
  DispositionSuccess(state, dispositions) {
    // console.log("dispositions", dispositions);
    state.dispositions = dispositions;
  },
  ...vuexfireMutations
}

export default {
  state,
  getters,
  actions,
  mutations
}
