<template>
	<div>
		<page-title-bar></page-title-bar>
		<app-section-loader :status="loader"></app-section-loader>
  	<v-container fluid grid-list-xl py-0>
			<v-layout row wrap>
				<app-card
					:heading="$t('message.searchRow')"
					:fullBlock="true"
					colClasses="xl12 lg12 md12 sm12 xs12"
				>
					<v-card-title>Contacts
						<v-spacer></v-spacer>
						<v-text-field
							append-icon="search"
							label="Search"
							single-line
							hide-details
							v-model="search"
						>
						</v-text-field>
					</v-card-title>
					<v-data-table
						v-bind:headers="headers"
						v-bind:items="contacts"
						v-bind:search="search"
					>
						<template slot="items" slot-scope="props">
<!-- 							<td>
								<v-edit-dialog lazy>
									{{ props.item.fullName }}
									<v-text-field
										slot="input"
										label="Edit"
										v-model="props.item.name"
										single-line
										counter
										:rules="[max25chars]">
									</v-text-field>
								</v-edit-dialog>
							</td> -->
							<td v-if="props.item && props.item.firstName">{{props.item.firstName}}</td>
							<td v-else>Unavailable</td>
							<td v-if="props.item && props.item.lastName">{{props.item.lastName}}</td>
							<td v-else>Unavailable</td>
							<td>{{ props.item.phone }}</td>
							<td>{{ props.item.email }}</td>
							<td>{{ props.item.source }}</td>
							<td v-if="props.item.createdAt">
								{{ props.item.createdAt }}</td>
							<td v-else>Unavailable</td>
							<td class="text-right">
								<v-btn fab depressed outline small :to="'/contacts/' + props.item.id"><v-icon>remove_red_eye</v-icon></v-btn>
								<v-btn fab depressed outline small><v-icon>delete</v-icon></v-btn>
							</td>
<!-- 							<td>
								<v-edit-dialog
									@open="tmp = props.item.iron"
									@save="props.item.iron = tmp || props.item.iron"
									large
									lazy
									>
								<div>{{ props.item.iron }}</div>
								<div slot="input" class="mt-3 title">Update Iron</div>
								<v-text-field
									slot="input"
									label="Edit"
									v-model="tmp"
									single-line
									counter
									autofocus
									:rules="[max25chars]"
									>
								</v-text-field>
								</v-edit-dialog>
							</td> -->
						</template>
						<template slot="pageText" slot-scope="{ pageStart, pageStop }">
							From {{ pageStart }} to {{ pageStop }}
						</template>
					</v-data-table>
				</app-card>
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
      loader: true,
      max25chars: v => v.length <= 25 || "Input too long!",
      tmp: "",
      search: "",
      pagination: {},
      headers: [
        {
          	text: "First Name",
          	value: "First Name"
        },
        {
          	text: "Last Name",
          	value: "Last Name"
        },
        {
        	text: "Phone",
          	value: "phone",
          	sortable: false
      	},
        {
        	text: "Email",
        	value: "email",
        	sortable: false
        },
        {
        	text: "Source",
        	value: "source"
        },
        {
        	text: "Creation",
        	value: "creation" ,

        },
        {}
      ]
    };
  },
  created() {
    this.$store.dispatch("getContacts");
  },
  computed: {
  	contacts: {
  		get(){
  			this.loader = false;
  			return this.$store.state.contacts.contacts;
  		}
  	}
  }
};
</script>
