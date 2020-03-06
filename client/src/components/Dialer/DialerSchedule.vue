<template>
  <div>
    <vue-perfect-scrollbar style="height:350px" :settings="settings">
      <v-list three-line class="notificationv2-widget-wrap" v-if="schedules!==null">
        <template v-for="item in schedules">
          <v-list-tile avatar ripple :key="item.id" @click="callSchedule(item)">
            <v-list-tile-avatar>
              <v-icon color="primary" dark>zmdi-time</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
              <h6 class="mb-1">{{fullName(item.firstName, item.lastName)}}</h6>
              <span class="fs-12 mb-1 d-block">
                <span class="mr-1 primary--text">
                  {{item.phone}}
                </span>
              </span>
              <!-- <p class="fs-12 grey--text mb-0">{{item.phone}}</p> -->
            </v-list-tile-content>
            <v-list-tile-action>
              <v-list-tile-action-text>
                <h6>{{convertTime(item.scheduleTime)}}</h6>
              </v-list-tile-action-text>
            </v-list-tile-action>
          </v-list-tile>
        </template>
      </v-list>
    </vue-perfect-scrollbar>
  </div>
</template>

<script>
import api from "../../api";
import { mapGetters } from "vuex";
import { convertTimeStampToDate } from "../../helpers/helpers";

export default {
  props: ["schedules"],
  data() {
    return {
      loader: true,
      phoneMask: ["+1 (###) ###-####"],
      masked: true,
      settings: {
        maxScrollbarLength: 300
      },
    };
  },
  methods: {
    convertTime(timestamp) {
      return convertTimeStampToDate(timestamp, "MM/DD/YYYY hh:mm");
    },
    fullName(firstName, lastName) {
      if (!firstName || firstName != null) {
        return firstName + " " + lastName;
      } else {
        return "No Named";
      }
    },
    callSchedule(item){
      this.$emit("scheduleCall", {
        callInfo:item
      })
    }
  }
};
</script>
