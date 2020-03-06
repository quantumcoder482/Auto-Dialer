<template>
  <div>
    <page-title-bar></page-title-bar>
    <v-container fluid grid-list-xl pt-0>
      <v-layout row wrap>
        <v-flex xs12 md5>
          <app-card>
            <v-layout row align-center justify-space-between ml-0 mr-0 pt-2 pb-2>
              <v-btn small color="gradient-purple" class="ma-0">Lead</v-btn>
              <h5 v-if="contact.createdAt">Created: {{contact.createdAt | formatDate}}</h5>
            </v-layout>
            <v-divider></v-divider>
            <h2 class="fw-bold mb-4" v-if="contact.firstName || contact.lastName">{{contact.firstName | capitalize}} {{contact.lastName | capitalize}}</h2>
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
            <v-divider></v-divider>
            <h4>Latest Note:</h4>
            <v-alert type="primary" outline :value="true" class="text-center">
              This contact has no notes...
            </v-alert>
          </app-card>
        </v-flex>
        <v-flex xs12 md7>
          <app-card contentCustomClass="pa-0">
            <v-tabs v-model="currentTab" grow slider-color="primary" centered>
              <v-tab v-for="(item, key, index) in contactTabs" :key="item">
              {{item}}
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="currentTab">
              <v-tab-item key="0">
                <v-card>
                 	<v-card-text :class="contact[contactTabs[currentTab]] === undefined ? '' : 'pa-0'">
	                  <table class="v-table bordered table-striped" v-if="contact.details">
	                    <tbody>
	                      <tr v-for="(item, key, index) in contact.details">
	                        <td><strong>{{key | propertySpacer | capitalize}}: </strong></td>
	                        <td>{{item}}</td>
	                      </tr>
	                    </tbody>
	                  </table>
	                  <span v-else>No data available.</span>
              		</v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item key="1">
                <v-card>
                  <v-card-text>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item key="2">
                <v-card>
                  <v-card-text>
                    <v-timeline>
                      <v-timeline-item v-for="n in 4" :key="n" color="red lighten-2" large>
                        <span slot="opposite">Tus eu perfecto</span>
                        <v-card class="elevation-2">
                          <v-card-title class="headline">Lorem ipsum</v-card-title>
                          <v-card-text>
                            Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut, sed euismod convenire principes at. Est et nobis iisque percipit, an vim zril disputando voluptatibus, vix an salutandi sententiae.
                          </v-card-text>
                        </v-card>
                      </v-timeline-item>
                    </v-timeline>
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </app-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container fluid>
      <v-layout align-center justify-end>
        <v-btn color="success" large @click="saveContactDetails" v-show="!disabled">Save</v-btn>
        <v-btn color="primary" large to="/contacts/" v-show="disabled">Close</v-btn>
      </v-layout>
    </v-container>
  </div>
</template>
<script>
import api from "../../api";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      disabled: true,
      contact: null,
      loader: true,
      contactTabs: [
        "details",
        "analytics",
        "notes"

      ],
      currentTab: 0
    }
  },
  created() {
    this.$store.dispatch("getContacts").then(response => {
      this.getContact()
    })
  },
  methods: {
    getContact() {
      this.contact = this.$store.getters.contactById(this.$route.params.id);
      this.loader = false;
    },
    saveContactDetails() {

    }
  }
}

</script>
