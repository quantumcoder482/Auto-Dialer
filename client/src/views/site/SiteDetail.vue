<template>
    <div>
        <page-title-bar></page-title-bar>
        <v-container fluid grid-list-xl py-0>

            <app-card
                    :heading="$t('message.siteDetails')"
                    customClasses="mb-30"
            >
                <v-form v-model="form2.valid" ref="form" lazy-validation>
                    <v-text-field
                            label="Site Domain"
                            v-model="form2.formData.siteName"
                            :rules="form2.domainNameRules"
                            required
                    ></v-text-field>
                    <v-layout row wrap>
                        <v-flex xs6>
                            <v-text-field
                                    label="Api Key"
                                    :disabled="true"
                                    v-model="form2.formData.apiKey"
                                    required
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs6>
                            <v-text-field
                                    label="Site Id"
                                    :disabled="true"
                                    v-model="form2.formData.siteId"
                                    required
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs6>
                            <v-text-field
                                    label="Last Trigger DateTime"
                                    :disabled="true"
                                    v-model="form2.formData.lastTrigger"
                                    required
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs6>
                            <v-text-field
                                    label="Creation Datetime"
                                    :disabled="true"
                                    v-model="form2.formData.creationDate"
                                    required
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-textarea
                            label="Description"
                            v-model="form2.formData.description"
                            :rules="form2.descriptionRules"
                            required
                    ></v-textarea>
                    <v-layout row wrap>
                        <v-flex xs4>
                            <v-checkbox
                                    v-model="form2.formData.userCheck"
                                    label="User Model "
                            ></v-checkbox>
                        </v-flex>
                        <v-flex xs4>
                            <v-checkbox
                                    v-model="form2.formData.contactCheck"
                                    label="Contact Model "
                            ></v-checkbox>
                        </v-flex>
                        <v-flex xs4>
                            <v-checkbox
                                    v-model="form2.formData.siteCheck"
                                    label="Site Model "
                            ></v-checkbox>
                        </v-flex>
                    </v-layout>

                    <v-btn
                            @click="update"
                            :disabled="!form2.valid"
                            color="success"
                    >
                        {{$t("message.update")}}
                    </v-btn>
                    <v-btn @click="remove" color="error">{{$t("message.remove")}}</v-btn>
                </v-form>
            </app-card>
        </v-container>
    </div>
</template>

<script>
    import Vue from 'vue'

    export default {
        data() {
            return {

                form2: {
                    valid: true,
                    name: "",
                    domainNameRules: [
                        v => !!v || "Domain Name is required",
                        // v => (v && v.length <= 10) || "Name must be less than 10 characters"
                    ],
                    descriptionRules: [
                        v => !!v || "Description is required",
                    ],
                    email: "",
                    formData: {
                        siteName: "",
                        description: "",
                        apiKey: "",
                        siteId: "",
                        lastTrigger: "",
                        creationDate: "",
                        userCheck: false,
                        siteCheck: false,
                        contactCheck: false
                    },
                    emailRules: [
                        v => !!v || "E-mail is required",
                        v =>
                            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
                            "E-mail must be valid"
                    ],
                    select: null,
                    items: ["Item 1", "Item 2", "Item 3", "Item 4"],
                    checkbox: false
                }

            };
        },

        created() {
            this.$store.dispatch("getSite", this.$route.params.id).then(response => {
                this.form2.formData = response.data;
                this.form2.formData.userCheck = response.data.postAvailable.substr(0,1) == '1' ? true: false;
                this.form2.formData.contactCheck = response.data.postAvailable.substr(1,1) == '1' ? true: false;
                this.form2.formData.siteCheck = response.data.postAvailable.substr(2,1) == '1' ? true: false;
            });

        },
        methods: {
            update() {
                if (this.$refs.form.validate()) {
                    this.$store.dispatch("updateSite", this.form2.formData);
                }
            },
            remove() {

                this.$store.dispatch("removeSiteDetail", this.$route.params.id).then(response => {
                    this.$router.push("/site/list");
                }).catch(error => {
                    console.log(error);
                    setTimeout(function () {
                        Vue.notify({
                            group: 'loggedIn',
                            type: 'error',
                            title: 'Error:',
                            text: 'site removed failed!'
                        });
                    }, 500);
                });
            }
        }
    };
</script>
