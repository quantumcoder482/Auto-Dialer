<template>
  <div>
    <!-- <v-layout row align-center justify-space-between ml-0 mr-0 pt-2 pb-2 style="margin-top: 10px;">
      <h3>Dialer Disposition</h3>
    </v-layout>-->
    <v-layout row wrap>
      <app-card colClasses="xs12 md12">
        <v-radio-group v-model="dispositionTypeId" column class="pt-0" style="margin:0 0 0 30px; ">
          <template v-for="(dispositionType, index) in dispositions">
            <v-radio
              color="primary"
              :label="dispositionType.description"
              :value="dispositionType.id"
              :key="index"
            ></v-radio>
          </template>
        </v-radio-group>
      </app-card>
    </v-layout>
    <v-layout v-if="dispositionTypeId == 3">
      <app-card colClass="xs6 md6">
        <v-dialog
          ref="dialogDate"
          persistent
          v-model="modalDate"
          lazy
          full-width
          width="290px"
          :return-value.sync="date"
        >
          <v-text-field
            slot="activator"
            label="Schedule Date"
            v-model="date"
            prepend-icon="event"
            readonly
          ></v-text-field>
          <v-date-picker v-model="date" scrollable>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="modalDate = false">Cancel</v-btn>
            <v-btn color="primary" @click="$refs.dialogDate.save(date)">OK</v-btn>
          </v-date-picker>
        </v-dialog>
      </app-card>
      <app-card colClass="xs6 md6">
        <v-dialog
          ref="dialogTime"
          persistent
          v-model="modalTime"
          lazy
          full-width
          width="290px"
          :return-value.sync="time"
        >
          <v-text-field
            slot="activator"
            label="Schedule Time"
            v-model="time"
            prepend-icon="access_time"
            readonly
          ></v-text-field>
          <v-time-picker v-model="time" actions>
            <v-btn color="error" @click="modalTime = false">Cancel</v-btn>
            <v-btn color="primary" @click="$refs.dialogTime.save(time)">Save</v-btn>
          </v-time-picker>
        </v-dialog>
      </app-card>
    </v-layout>
    <v-layout align-center justify-end>
      <v-btn
        color="primary"
        class="ma-2"
        :loading="loading"
        :disabled="loading || dispositionTypeId == null"
        large
        @click="saveDispositionDetails"
      >Save</v-btn>
    </v-layout>
  </div>
</template>
<script>
import Vue from "vue";
import api from "../../api";
import { mapGetters } from "vuex";
import { convertDateTimeToTimeStamp } from "../../helpers/helpers";
import { dialerQueueRef } from "../../firebase";

export default {
  props: ["dialInfo"],
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      time: "00:00",
      modalDate: false,
      modalTime: false,
      dispositionTypeId: null,
      dispositions: null,
      loading: false,
      datetime: null
    };
  },
  watch: {
    dialInfo(val){
      console.log(val);
    }
  },
  computed: {
    dialInformation(){
      // console.log(this.dialInfo);
      if(this.dialInfo){
        return dialInfo;
      }else{
        return null;
      }
    }
  },
  methods: {
    async saveDispositionDetails() {
      let scheduleDateTime = null;
      let userId = localStorage.getItem("userId");
      this.loading = true;
      const postData = {
        contactId: this.dialInfo.contactId,
        dispositionTypeId: this.dispositionTypeId,
        firstName: this.dialInfo.firstName,
        lastName: this.dialInfo.lastName,
        phone: this.dialInfo.phone,
        callTime: 2000
      };

      // Disposition Type is call_back for schedule
      if (this.dispositionTypeId == 3) {
        if (!this.date || !this.time) {
          Vue.notify({
            group: "disposition",
            type: "error",
            title: "Error:",
            text: "You have to input schedule time correctly!"
          });
          this.loading = false;
          return;
        } else {
          scheduleDateTime = convertDateTimeToTimeStamp(
            this.date,
            this.time,
            "YYYY-MM-DD hh:mm:ss"
          );

          // Add new schedule
          let newDialQueueData = {
            ...this.dialInfo,
            scheduleTime: scheduleDateTime,
            assignedId: userId,
            createdAt: Date.now()
          };
          newDialQueueData = Vue._.omit(newDialQueueData, "id");
          await dialerQueueRef.push(newDialQueueData);

        }
        // Dispoisitin type is No Answer
      } else if (this.dispositionTypeId == 2) {
        if (this.dialInfo.repeatCount <= 2) {
          // Create new dialer Queue item
          let newDialQueueData = {
            ...this.dialInfo,
            assignedId:'',
            scheduleTime:'',
            repeatCount: this.dialInfo.repeatCount + 1,
            createdAt: Date.now()
          };

          newDialQueueData = Vue._.omit(newDialQueueData, ["id"]);
          await dialerQueueRef.push(newDialQueueData);

          // console.log("newdialdata_repeat", newDialQueueData);
        } else {
          // Post data to Datalot API
          await this.sellLead().then(res=>{
            console.log(res);
          });
        }
      } else if(this.dispositionTypeId == 6){
        await this.sellLead();
      }

      this.$store.dispatch("postDialerHistory", postData).then(response => {
        // console.log("response=>", response);
        this.loading = false;
        this.dispositionTypeId = null;
        this.date = new Date().toISOString().substr(0, 10);
        this.time = "00:00";
        this.$emit("dispositionStatus", {
          dispositionStatus: "success"
        });
      });
    },
    async sellLead(){
      let contactId = this.dialInfo.contactId;
      let contactData, contactDetails;
      await this.$store.dispatch("getContact", {contactId:contactId}).then(res=>{
        contactData = res.data;
      });
      await this.$store.dispatch("getContactDetails", {contactId:contactId, type: 'object'}).then(res=>{
        contactDetails = res.data;
      });

console.log(contactId);

      let postLeadData = {
        firstName: contactData.firstName,
        lastName: contactData.lastName,
        email: contactData.email,
        phone: contactData.phone,
        ...contactDetails
      }

      console.log('PostData', postLeadData);
      await api.post('/datalot/insertLead', postLeadData).then(response =>{
        console.log("Datalot result",response);
      });

      await api.post('/px/insertLead', postLeadData).then(response => {
        console.log("px result", response);
      });

      return;

    }
  },
  created() {
    this.$store.dispatch("getDispositions").then(response => {
      this.dispositions = response;
    });
  },
  mounted(){

  }
};
</script>
