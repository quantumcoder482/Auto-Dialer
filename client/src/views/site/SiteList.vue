<template>
	<div>
		<page-title-bar></page-title-bar>
		<app-section-loader :status="loader"></app-section-loader>
		<v-container fluid grid-list-xl py-0>
			<v-layout row wrap>
				<app-card
						:heading="$t('message.sitesList')"
						:fullBlock="true"
						colClasses="xl12 lg12 md12 sm12 xs12"
				>
					<v-card-title>Sites
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
							v-bind:items="sites"
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

							<td class="text-center">{{ props.item.siteName }}</td>
							<td class="text-center">{{ props.item.apiKey }}</td>
							<td class="text-center">{{ props.item.lastTrigger }}</td>
							<td class="text-center">{{ props.item.creationDate }}</td>
							<td class="text-right">
								<v-btn fab depressed outline small color="info" :to="'/site/' + props.item.id"><v-icon>remove_red_eye</v-icon></v-btn>
								<v-btn fab depressed outline small color="error" @click="deleteFn(props.item.id)" ><v-icon>delete</v-icon></v-btn>
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
                        text: "Site Name",
                        value: "Site Name",
                        align:  'center'
                    },
                    {
                        text: "Api Key",
                        value: "Api Key",
                        align:  'center'
                    },
                    {
                        text: "Last Trigger",
                        value: "Last Trigger",
                        align:  'center',
                        sortable: false
                    },
                    {
                        text: "Creation Date",
                        value: "Creation Date",
                        align:  'center',
                        sortable: false
                    },
                    {
                        text: "Action",
                        value: "Action",
                        align:  'center'
                    }
                ]
            };
        },
        created() {
            this.$store.dispatch("getSites");
        },
		methods: {
            deleteFn(id){
                this.$store.dispatch("removeSite", id);
			}
		},
        computed: {
            sites: {
                get(){
                    this.loader = false;
                    return this.$store.state.site.sites;
                }
            }
        }
    };
</script>
