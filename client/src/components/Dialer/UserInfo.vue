<template>
  <div>
    <v-layout row align-center justify-space-between ml-0 mr-0 pt-2 pb-2 style="margin-top: 10px;">
        <!-- <h5 v-if="contact.createdAt">Created: {{contact.createdAt | formatDate}}</h5> -->
      <h1>Customer Details</h1>
    </v-layout>
    <v-divider></v-divider>
    <h2 class="fw-bold mb-4" v-if="contact.details">{{contact.details.firstName | capitalize}} {{contact.details.lastName | capitalize}}</h2>
    <h2 class="fw-bold mb-4" v-else>{{contact.email}}</h2>
    <v-layout column>
      <v-flex>
        <v-layout row align-center>
          <v-btn fab color="primary" small class="mt-0 mb-0">
            <v-icon>location_on</v-icon>
          </v-btn>
          <h4 class="mb-0">Port Saint Lucie, <br> <small>FL. United States, 34953</small></h4>
        </v-layout>
      </v-flex>
      <v-flex>
        <v-layout row wrap>
          <h6 class="fw-bold">
            <v-btn fab color="primary" small flat>
              <v-icon>mail</v-icon>
            </v-btn> {{contact.email}}
          </h6>
          <h6 class="fw-bold">
            <v-btn fab color="primary" small flat>
              <v-icon>phone</v-icon>
            </v-btn> {{contact.phone}}
          </h6>
          <h6 class="fw-bold">
            <v-btn fab color="primary" small flat>
              <v-icon>link</v-icon>
            </v-btn> {{contact.source}}
          </h6>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>
<script>
import api from "../../api";
import { mapGetters } from "vuex";
export default {
  props:['customerId'],
  data(){
    return {
      contact: null,
    }
  },
  created() {
    this.$store.dispatch("getContacts").then(response => {
      this.getContact()
    });
  },
  methods: {
    getContact() {
      // this.contact = this.$store.getters.contactById(this.$route.params.id);
      this.contact = this.$store.getters.contactById(this.customerId);
    },
  }
}
</script>
