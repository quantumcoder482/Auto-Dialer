<template>
  <div>
    <v-toolbar color="primary" dark>
			<v-toolbar-title class="text-xs-center">{{ $t('message.dialer') }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleAvailable">
        <v-tooltip color="primary" left>
          <v-icon color="success" size="35px" v-if="availableCall" slot="activator">zmdi-phone-in-talk</v-icon>
          <v-icon color="error" size="35px" v-if="!availableCall" slot="activator">zmdi-phone-in-talk</v-icon>
          <span>Toggle AutoDial</span>
        </v-tooltip>
      </v-btn>
		</v-toolbar>
    <v-layout wrap>
      <v-flex xs12 md12>
        <app-card contentCustomClass="pa-0">
          <v-tabs v-model="currentTab" grow slider-color="primary" centered>
            <v-tab v-for="(item, key, index) in dialerTabs" :key="index">
            {{item}}
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="currentTab">
            <v-tab-item key="0">
              <v-card>
                <dialer-history :histories="dialerHistories"></dialer-history>
              </v-card>
            </v-tab-item>
            <v-tab-item key="1">
              <v-card>
                <dialer-queue v-on:queueCall="getQueueCall" :queues="dialerQueue"></dialer-queue>
              </v-card>
            </v-tab-item>
            <v-tab-item key="2">
              <v-card>
                <dialer-schedule v-on:scheduleCall="getScheduleCall" :schedules="dialerSchedules"></dialer-schedule>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </app-card>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs12 md12>
        <app-card v-show="readyDial">
          <dialer v-on:dialerStatus="getDialerStatus" :contactInfo="contactInfo" ></dialer>
        </app-card>
        <app-card v-show="!readyDial">
          <dialer-disposition v-on:dispositionStatus="getDispositionStatus" :dialInfo="dialInfo"></dialer-disposition>
        </app-card>
        <!-- <app-card style="margin-top: 30px;" v-if="calling">
          <user-info :customerId="selectedCustomerId"></user-info>
        </app-card> -->
      </v-flex>
    </v-layout>
    <!-- <v-layout>
      <v-card style="text-align:center; width:100%">
        <v-btn :color="availableCall?'success':'error'" rounded large @click="toggleAvailable">{{availableCall?'Available':'Unavailable'}}</v-btn>
      </v-card>
    </v-layout> -->
  </div>
</template>
<script>
import api from "../../api";
import Vue from "vue";
import { mapGetters } from "vuex";
import Dialer from "./Dialer";
import DialerDisposition from "./DialerDisposition";
import DialerHistory from "./DialerHistory";
import DialerQueue from "./DialerQueue";
import DialerSchedule from "./DialerSchedule";
import UserInfo from "./UserInfo";
import { database, dialerQueueRef} from "../../firebase";

export default {
  data() {
    return {
      dialerTabs: [
        "history",
        "queue",
        "schedule"
      ],
      currentTab: 0,
      autoUpdateStoreId: null,      // Automatic sync store data
      autoDialerIntervalId: null,   // Auto Dialer Interval
      availableCall:false,
      contactInfo: null,            // for dialer
      dialInfo: null,               // for disposition
      endCall: false,
      calling: false,
      phoneConnection: null,
      readyDial: true,
      autoDialTimer: null,
      // unusefull states
      selectedCustomerId: 38,
      showUserInfo: false,
      availableButtonText: '',
      availableButton: ''
    }
  },
  computed:{
    dialerQueue(){
      // newQueue is the queue items that was created newly, and repeated Queue is the queue that has the repeated call by the agent
      let newQueue = Vue._.filter(this.$store.state.dialer.dialerQueue, function(o){return !o.assignedId && o.repeatCount === 0});
      let repeatedQueue = Vue._.filter(this.$store.state.dialer.dialerQueue, function(o){return !o.assignedId && o.repeatCount !== 0});

      // arrange queues
      Vue._.reverse(newQueue);
      // Vue._.reverse(repeatedQueue);

      let queueData = Vue._.concat(newQueue, repeatedQueue);
      Vue._.map(queueData, function(value){
        value.id=value['.key'];
        return value;
      });
      // console.log(queueData);
      return queueData;
    },
    dialerSchedules(){
      let userId = localStorage.getItem('userId');
      let queueSchedule = Vue._.filter(this.$store.state.dialer.dialerQueue, function(o){return o.assignedId==userId});
      queueSchedule = Vue._.sortBy(queueSchedule, o => {
         return o.scheduleTime;
      })
      // Vue._.reverse(queueSchedule);
      return queueSchedule;
    },
    dialerHistories(){
      let dialerHistoires = this.$store.state.dialer.dialerHistories;
      // console.log(dialerHistoires);
      return Vue._.reverse(dialerHistoires);
    }
  },
  watch:{
    availableCall(val){
      if(val){
        // console.log(val);
        this.autoDialerIntervalId = setInterval(()=>{
          console.log("auto dialing ....");
          // console.log(this.calling);
          if(!this.calling && this.readyDial){
            if(this.dialerQueue.length != 0){
              this.contactInfo = this.dialerQueue[0];
              // Remove Contact Info from Dialer Queue
              setTimeout(()=>{
                dialerQueueRef.child(this.dialerQueue[0].id).remove().then(res=>{
                  // console.log("remove child", res);
                });
              }, 800);
            }
          }
        }, this.autoDialTimer);
      }else{
        clearInterval(this.autoDialerIntervalId);
      }
    },
    phoneConnection(val){
      if(val==null){
        this.contactInfo = null;
      }
    }
  },
  methods: {
    automaticUpdateStore(){
      this.autoUpdateStoreId =  setInterval(()=>{
        this.$store.dispatch("getDialerHistories");
      }, 3000);
    },
    // Toggle Available Button Status
    toggleAvailable(){
      this.availableCall = !this.availableCall;
      this.$store.dispatch('getUserMetaData', {key:'availableCall'})
        .then(res=>{
          if(res){
            this.$store.dispatch('updateUserMetaData', {...res, metaValue:this.availableCall?1:0})
              .then(res=>{
                localStorage.setItem("availableCall", this.availableCall?1:0);
                this.setAvailableButton();
              });
          } else {
            this.$store.dispatch('postUserMetaData', {key:'availableCall', value:this.availableCall?1:0})
              .then(res=>{
                localStorage.setItem("availableCall", this.availableCall?1:0);
                this.setAvailableButton();
              });
          }
        });

    },
    // Change Available Button Status
    setAvailableButton(){
      if(this.availableCall){
        this.availableButtonText = 'Available';
        this.availableButton = 'success';
      }else{
        this.availableButtonText = 'Unavailable';
        this.availableButton = 'error';
      }
    },
    // Get Dialer Status realtime (autodialing, manual dialing)
    getDialerStatus(status){
      // console.log("dialerStatus", status);
      // this.selectedCustomerId = status.selectedCustomerId;
      this.calling = status.calling;
      this.phoneConnection = status.connection;
      if(status.dialedData != null && status.connection == null){
        this.dialInfo = status.dialedData;
        this.readyDial = false;
      }
    },
    // Get Disposition Status when ended dial
    getDispositionStatus(status){
      // console.log("dispositionStatus:", status);
      if(status.dispositionStatus=='success'){
        this.readyDial = true;
      }
    },

    // Dial from Schedule List
    getScheduleCall(info){
      // console.log(info);
      if(!this.calling && this.readyDial && !this.availableCall){
        if(info.callInfo != null){
          this.contactInfo = info.callInfo;
          // Remove Contact Info from Dialer Queue
          setTimeout(()=>{
            dialerQueueRef.child(info.callInfo['.key']).remove().then(res=>{
              // console.log("remove child", res);
            });
          }, 800);
        }
      }
    },

    // Dial from Queue List
    getQueueCall(info){
      // console.log(info);
      if(!this.calling && this.readyDial && !this.availableCall){
        if(info.callInfo != null){
          this.contactInfo = info.callInfo;
          // Remove Contact Info from Dialer Queue
          setTimeout(()=>{
            dialerQueueRef.child(info.callInfo['.key']).remove().then(res=>{
              // console.log("remove child", res);
            });
          }, 800);
        }
      }
    }
  },
  created(){
    this.$store.dispatch("getDialerHistories");
    this.$store.dispatch("getDispositions");
    this.$store.dispatch("bindDialerQueueRef");
    this.automaticUpdateStore();

    this.autoDialTimer = process.env.AUTO_DIALER_TIEMR?process.env.AUTO_DIALER_TIEMR:5000;

    // this.$store.dispatch("getDialerQueueLoopback")
    //   .then(response => {
    //     let dialerQueue = this.$store.state.dialer.dialerQueue;
    //     let dialerSchedules = this.$store.state.dialer.dialerSchedules;
    //     console.log("dialerQueue:", dialerQueue);
    //     console.log("dialerSchedules:", dialerSchedules);
    //   });

  },
  mounted(){
    // Initialize availableCall button
    if(localStorage.getItem("availableCall") !== null && localStorage.getItem("availableCall") == 1 ) {
      this.availableCall = true;
    }
    this.setAvailableButton();

  },
  beforeDestroy () {
    clearInterval(this.autoUpdateStoreId);

    // Make Agent status is unavailable
    this.$store.dispatch('getUserMetaData', {key:'availableCall'})
      .then(res=>{
        if(res){
          this.$store.dispatch('updateUserMetaData', {...res, metaValue:0})
            .then(res=>{
              localStorage.setItem("availableCall", 0);
            });
        } else {
          this.$store.dispatch('postUserMetaData', {key:'availableCall', value:0})
            .then(res=>{
              localStorage.setItem("availableCall", 0);
            });
        }
      });

  },
  components:{
    Dialer,
    DialerDisposition,
    DialerHistory,
    DialerQueue,
    DialerSchedule,
    UserInfo
  }
}

</script>
