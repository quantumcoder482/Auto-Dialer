<template>
  <div>
    <app-section-loader :status="loader"></app-section-loader>
    <div class="profile-head app-card mb-30" :user="user" v-if="user != null">
      <div class="profile-top">
        <img src="/static/img/profile-banner.jpg" alt="profile banner" width="1920" height="165" />
      </div>
      <div class="profile-bottom border-bottom-light-1">
        <div class="user-image text-xs-center mb-3">
          <img
            src="/static/avatars/user-7.jpg"
            class="img-responsive rounded-circle"
            alt="user images"
          />
        </div>
        <div class="user-list-content">
          <div class="text-xs-center">
            <h3
              class="fw-bold"
              v-if="user.details"
            >{{user.details.firstName | capitalize}} {{user.details.lastName | capitalize}}</h3>
            <h3 class="fw-bold" v-else>{{user.email}}</h3>
            <p></p>
            <v-container>
              <v-form @submit.prevent lazy-validation>
                <v-layout row justify-space-between align-center>
                  <v-flex>
                    <h3 class="text-left">Account Details:</h3>
                  </v-flex>
                  <v-flex xs4 md1>
                    <v-layout row justify-content-end>
                      <v-btn outline small fab @click="disabled = !disabled">
                        <v-icon>edit</v-icon>
                      </v-btn>
                      <v-btn outline small fab @click>
                        <v-icon>delete</v-icon>
                      </v-btn>
                    </v-layout>
                  </v-flex>
                </v-layout>
                <v-layout row wrap align-start>
                  <v-flex xs12 sm6 text-left>
                    <v-text-field
                      :disabled="disabled"
                      name="email"
                      label="Email Address"
                      id="email"
                      v-model="user.email"
                      :rules="rules.emailRules"
                      :success="user.email ? true : false"
                    ></v-text-field>
                    <v-text-field
                      disabled
                      name="password"
                      label="Password"
                      id="password"
                      :disabled="disabled"
                      v-show="!disabled"
                    ></v-text-field>
                    <v-text-field
                      name="phone"
                      label="Phone Number"
                      id="phone"
                      v-model="user.details.phoneNumber"
                      :rules="rules.phoneRules"
                      :success="user.details.phoneNumber ? true : false"
                      validate-on-blur
                      :disabled="disabled"
                      :placeholder="phonePlaceholder"
                    ></v-text-field>
                  </v-flex>
                  <template v-if="user.details">
                    <v-flex xs12 sm6 text-left>
                      <template v-for="(detail, index) in user.details">
                        <v-text-field
                          v-if="checkDetailFields(index)"
                          :disabled="disabled"
                          :key="index"
                          name="index"
                          :label="index | propertySpacer | capitalize"
                          id="index"
                          :rules="rules.empty"
                          v-model="user.details[index]"
                          validate-on-blur
                        ></v-text-field>
                      </template>
                    </v-flex>
                  </template>
                </v-layout>
              </v-form>
              <v-layout align-center justify-end>
                <v-btn color="success" large @click="saveUserDetails" v-show="!disabled">Save</v-btn>
                <v-btn color="primary" large to="/users/" v-show="disabled">Close</v-btn>
              </v-layout>
            </v-container>
            <div class="social-list clearfix mb-4">
              <ul class="list-inline d-inline-block">
                <li>
                  <a href="javascript:void(0);" class="pink--text">
                    <i class="ti-facebook"></i>
                  </a>
                </li>
                <li>
                  <a href="javascript:void(0);" class="pink--text">
                    <i class="ti-twitter-alt"></i>
                  </a>
                </li>
                <li>
                  <a href="javascript:void(0);" class="pink--text">
                    <i class="ti-google"></i>
                  </a>
                </li>
                <li>
                  <a href="javascript:void(0);" class="pink--text">
                    <i class="ti-linkedin"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <!--       <div class="user-activity text-xs-center">
            <ul class="list-inline d-inline-block">
              <li>
                <span class="fw-bold">588</span>
                <span>Articles</span>
              </li>
              <li>
                <span class="fw-bold">2400</span>
                <span>Followers</span>
              </li>
              <li>
                <span class="fw-bold">1200</span>
                <span>Following</span>
              </li>
            </ul>
      </div>-->
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import phone from "phone";

export default {
  data() {
    return {
      loader: true,
      user: null,
      disabled: true,
      id: this.$route.params.id,
      rules: {
        empty: [v => !!v || "Field cannot be left blank"],
        phoneRules: [
          v => !!v || "Phone is required",
          v =>
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
              v
            ) || "Phone must be valid"
        ],
        emailRules: [
          v => !!v || "E-mail is required",
          v => /.+@.+/.test(v) || "E-mail must be valid"
        ]
      },
      phonePlaceholder: "+13334445555"
    };
  },
  created() {
    this.$store.dispatch("getUsers").then(res=>{
      this.getUserDetails();
    });
  },
  beforeUpdate(){
    this.getUserDetails();
  },
  computed: {
    // user: {
    //   get() {
    //     this.loader = false;
    //     if (!isNaN(this.$route.params.id)) {
    //       return this.$store.getters.userById(this.$route.params.id);
    //     } else {
    //       return this.$store.getters.userById(localStorage.getItem("userId"));
    //     }
    //   }
    // }
  },
  methods: {
    getUserDetails() {
      if (!isNaN(this.$route.params.id)) {
        this.user = this.$store.getters.userById(this.$route.params.id);
      } else {
        this.user = this.$store.getters.userById(localStorage.getItem("userId"));
      }
      this.loader = false;
    },
    saveUserDetails() {
      // if (this.user.details.phoneNumber) {
      //   let phoneNumberArr = phone(this.user.details.phoneNumber);
      //   this.user.details.phoneNumber = phoneNumberArr[0];
      //   console.log(phoneNumberArr[0]);
      // }
      this.$store.dispatch("updateUserDetails", this.user);
      if(this.user.details.phoneNumber != ''){
        localStorage.setItem('phoneNumber', this.user.details.phoneNumber);
      }

      /*
          .then(response=>{
            console.log(response);
            if(response.data.metaKey=='phoneNumber'){
              localStorage.setItem('phoneNumber', response.data.metaValue);
            }
            Vue.notify({
              group: 'loggedIn',
              type: 'success',
              title: 'Success:',
              text: 'Successfuly Saved Details!'
            });
          })
          .catch(error => {
            console.log(error);
              Vue.notify({
                group: 'loggedIn',
                type: 'error',
                title: 'Error:',
                text: 'Save Details failed!'
              });
          })
          */
    },
    checkDetailFields(index) {
      if (index == "phoneNumber" || index == "availableCall") {
        return false;
      } else {
        return true;
      }
    },
    forceUpdateComponent() {
      this.$forceUpdate();
    }
  }
};
</script>
