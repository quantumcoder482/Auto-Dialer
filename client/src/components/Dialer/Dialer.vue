<template>
  <div>
    <app-card style="padding-top:5px;padding-bottom: 5px;">
      <div id="dialer">
        <!-- Dialer input -->
        <div class="input-group input-group-md" v-cloak>
          <!-- Create a country code dropdown -->
          <div class="input-group-btn">
            <button
              type="button"
              class="btn btn-default dropdown-toggle"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              +
              <span class="country-code">{{ countryCode }}</span>
              <i class="zmdi zmdi-caret-down"></i>
            </button>
            <ul class="dropdown-menu">
              <li v-for="country in countries" :key="country.code">
                <a href="#" @click.prevent="selectCountry(country)">
                  <div :class="'flag flag-' + country.code"></div>
                  <span>{{ country.name }} (+{{ country.cc }})</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Telephone input field -->
          <input
            type="tel"
            class="form-control"
            :v-mask="phoneMask"
            v-model="currentNumber"
            placeholder="(555) 666-7777"
          />
        </div>

        <!-- <v-text-field
          v-model="currentNumber"
          :masked="masked"
          :v-mask="phoneMask"
          placeholder="+1 (333) 444-5555"
          prepend-inner-icon="phone"
          solo
        ></v-text-field> -->

        <!-- Audio Controls -->
        <div class="controls">
          <button
            class="btn btn-circle"
            @click="toggleCall('')"
            :class="[ onPhone ? 'btn-danger': 'btn-success' ]"
            :disabled="!validPhone"
          >
            <i class="zmdi zmdi-phone" :class="[ onPhone ? 'fa-close': 'fa-phone' ]"></i>
          </button>

          <button class="btn btn-circle btn-default" v-if="onPhone" @click="toggleMute">
            <i class="zmdi" :class="[ muted ? 'zmdi-mic-off': 'zmdi-mic' ]"></i>
          </button>
        </div>

        <!-- DTMF Tone interface -->
        <div class="keys">
          <div class="key-row">
            <button class="btn btn-circle btn-default" @click="sendDigit('1')">1</button>
            <button class="btn btn-circle btn-default" @click="sendDigit('2')">
              2
              <span>A B C</span>
            </button>
            <button class="btn btn-circle btn-default" @click="sendDigit('3')">
              3
              <span>D E F</span>
            </button>
          </div>
          <div class="key-row">
            <button class="btn btn-circle btn-default" @click="sendDigit('4')">
              4
              <span>G H I</span>
            </button>
            <button class="btn btn-circle btn-default" @click="sendDigit('5')">
              5
              <span>J K L</span>
            </button>
            <button class="btn btn-circle btn-default" @click="sendDigit('6')">
              6
              <span>M N O</span>
            </button>
          </div>
          <div class="key-row">
            <button class="btn btn-circle btn-default" @click="sendDigit('7')">
              7
              <span>P Q R S</span>
            </button>
            <button class="btn btn-circle btn-default" @click="sendDigit('8')">
              8
              <span>T U V</span>
            </button>
            <button class="btn btn-circle btn-default" @click="sendDigit('9')">
              9
              <span>W X Y Z</span>
            </button>
          </div>
          <div class="key-row">
            <button class="btn btn-circle btn-default" @click="sendDigit('*')">*</button>
            <button class="btn btn-circle btn-default" @click="sendDigit('0')">0</button>
            <button class="btn btn-circle btn-default" @click="sendDigit('#')">#</button>
          </div>
        </div>

        <!-- Status logging -->
        <div class="log" v-cloak>{{ log }}</div>
      </div>
    </app-card>
    <v-dialog v-model="dialog" persistent max-width="350">
      <v-card>
        <v-card-title class="headline">Please Check Your Agent Phone Number</v-card-title>
        <v-card-text>You have to set your agent phone number for dialing. Please set your phone number and sign in again</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialog = false">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import api from "Api";
import Vue from "vue";
import { Device } from "twilio-client";
import { country } from "./data";

export default {
  props: {
    contactInfo: {
      type: Object
    }
  },
  data() {
    return {
      countryCode: "1",
      currentNumber: "",
      muted: false,
      onPhone: false,
      log: "Connecting...",
      countries: country.data,
      connection: null,
      twilioDevice: Device,
      phoneMask: "+1(###) ###-####",
      masked:true,
      dialog: false
    };
  },
  computed: {
    // Computed property to validate the current phone number
    validPhone() {
      return /^([0-9]|#|\*)+$/.test(this.currentNumber.replace(/[-()\s]/g, ""));
    },
    agentNumber(){
      return localStorage.getItem('phoneNumber')?localStorage.getItem('phoneNumber'):"";
    }
  },
  watch: {
    contactInfo(info){
      console.log(info);
      if(info != null){
        this.currentNumber = info.phone.substring(2);
        this.toggleCall(info.phone);
      }
    }
  },
  methods: {
    // Handle country code selection
    selectCountry: function(country) {
      this.countryCode = country.cc;
    },

    // Handle muting
    toggleMute: function() {
      this.muted = !this.muted;
      this.twilioDevice.activeConnection().mute(this.muted);
    },

    // Make an outbound call with the current number,
    // or hang up the current call
    toggleCall: async function(defaultNumber) {
      if (!this.onPhone) {
        this.muted = false;
        this.onPhone = true;

        if(defaultNumber != ''){
          var n = defaultNumber;
        }else {
          // make outbound call with current number
          var n = "+" + this.countryCode + this.currentNumber.replace(/\D/g, "");
        }

        if(this.agentNumber == '' || this.agentNumber == 'undefined'){
          this.$router.push("/user/profile");
          this.dialog = true;
          this.onPhone = false;
          this.postDialerStatus();
        }else {
          this.connection = await this.twilioDevice.connect({
            number: n,
            agentnumber: this.agentNumber
          });

          this.log = "Calling " + n;
          if(this.contactInfo != null){
            this.$router.push("/contacts/"+this.contactInfo.contactId);
          }
        }
      }else {
        // hang up call in progress
        await this.twilioDevice.disconnectAll();
      }
      this.postDialerStatus();
    },

    // Handle numeric buttons
    sendDigit: function(digit) {
      this.connection.sendDigits(digit);
    },

    // post dialer status to parent Component
    postDialerStatus() {
      this.$emit("dialerStatus", {
        // selectedCustomerId: this.contactInfo.contactId,
        calling: this.onPhone,
        connection: this.connection,
        twilioDeviceReady: true,
        dialedData: this.contactInfo
      });
    }
  },
  created() {
    var self = this;
    // Fetch Twilio capability token from our Node.js server
    api
      .get("/twiliotoken")
      .then(response => {
        this.twilioDevice.setup(response.data.token);
      })
      .catch(error => {
        console.log(error);
        self.log = "Could not fetch token, see console.log";
      });

    // Configure event handlers for Twilio Device
    this.twilioDevice.disconnect(function() {
      self.onPhone = false;
      self.connection = null;
      self.log = "Call ended.";
      self.postDialerStatus();
    });

    this.twilioDevice.ready(function() {
      self.log = "Connected";
    });

  }
};
</script>
<style scope>
#dialer {
  font-family: Helvetica, sans-serif;
  margin: 10px auto;
  padding: 0;
  width: 100%;
  text-align: center;
}
[v-cloak] {
  display: none;
}
</style>
