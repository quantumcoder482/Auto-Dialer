<template>
  <vue-perfect-scrollbar style="height:350px" :settings="settings">
    <v-list three-line class="notificationv2-widget-wrap" v-if="queues!==null">
      <template v-for="item in queues">
        <v-list-tile avatar ripple :key="item.id" @click="callQueue(item)">
          <v-list-tile-avatar>
            <v-icon
              color="primary"
              dark
            >zmdi-phone</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <h6 class="mb-1">{{fullName(item.firstName, item.lastName)}}</h6>
            <span class="fs-12 mb-1 d-block">
              <span class="mr-1">
                <span>{{convertTime(item.createdAt)}}</span>
              </span>
            </span>
            <!-- <p class="fs-12 grey--text mb-0">{{item.phone}}</p> -->
          </v-list-tile-content>
          <v-list-tile-action>
            <v-list-tile-action-text>
              <h6 style="color:#5d92f4">{{item.phone}}</h6>
            </v-list-tile-action-text>
          </v-list-tile-action>
        </v-list-tile>
      </template>
    </v-list>
  </vue-perfect-scrollbar>
</template>

<script>
import api from "../../api";
import { mapGetters } from "vuex";
import Avatar from 'vue-avatar'
import { convertTimeStampToDate } from "../../helpers/helpers";

export default {
  props: ["queues"],
  data() {
    return {
      loader: true,
      avatarIconColor: [
        'primary', 'error', 'warning', 'info'
      ],
      settings: {
        maxScrollbarLength: 300
      },
      phoneMask: ["+1 (###) ###-####"],
      masked: true
    };
  },
  computed:{

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
    getAvatarIconColor(){
      let id = Math.floor(Math.random()*4);
      console.log(id);
      return this.avatarIconColor[id];
    },
    callQueue(item){
      this.$emit("queueCall", {
        callInfo:item
      })
    }
  },
};
</script>
