<template>
  <vue-perfect-scrollbar style="height:350px" :settings="settings">
    <v-list two-line class="notification-wrap" v-if="histories != null">
      <template v-for="item in histories">
        <v-list-tile avatar ripple :key="item.id" @click>
          <v-list-tile-avatar>
            <v-tooltip bottom>
              <v-icon
                :color="dispositionTypeIcons[item.dispositionTypeId-1].color"
                dark
                slot="activator"
              >{{dispositionTypeIcons[item.dispositionTypeId-1].icon}}</v-icon>
              <span>{{item.dispositionType.description}}</span>
            </v-tooltip>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              <h6 class="mb-0">{{fullName(item.firstName, item.lastName)}}</h6>
            </v-list-tile-title>
            <v-list-tile-sub-title class="grey--text fs-12">
              <the-mask :mask="phoneMask" :masked="masked" :value="item.phone"></the-mask>
            </v-list-tile-sub-title>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-list-tile-action-text>{{item.created | formatDate }}</v-list-tile-action-text>
          </v-list-tile-action>
        </v-list-tile>
      </template>
    </v-list>
  </vue-perfect-scrollbar>
</template>

<script>
import api from "../../api";
import { mapGetters } from "vuex";

export default {
  props: ["histories"],
  data() {
    return {
      dispositionTypeIcons: [
        {
          key: "not_interested",
          icon: "zmdi-phone-end",
          color: "warning"
        },
        {
          key: "no_answer",
          icon: "zmdi-phone-missed",
          color: "error"
        },
        {
          key: "call_back",
          icon: "zmdi-time",
          color: "info"
        },
        {
          key: "customer_service",
          icon: "zmdi-account",
          color: "primary"
        },
        {
          key: "cancellation",
          icon: "zmdi-rotate-left",
          color: "info"
        },
        {
          key: "sold",
          icon: "zmdi-money-box",
          color: "success"
        }
      ],
      phoneIcons: [
        "zmdi zmdi-phone-end",
        "zmdi zmdi-phone-missed",
        "zmdi zmdi-phone-in-talk",
        "zmdi zmdi-phone",
        "zmdi zmdi-phone-setting",
        "zmdi zmdi-phone-in-talk",
        "zmdi zmdi-phone-forwarded",
        "zmdi zmdi-phone-ring",
        "zmdi zmdi-phone-paused"
      ],
      settings: {
        maxScrollbarLength: 300
      },
      phoneMask: "+1 (###) ###-####",
      masked: true
    };
  },
  methods: {
    fullName(firstName, lastName) {
      if (!firstName || firstName != null) {
        return firstName + " " + lastName;
      } else {
        return "No Named";
      }
    }
  }
};
</script>
