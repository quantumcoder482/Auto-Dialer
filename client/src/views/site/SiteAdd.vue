<template>
    <div>
        <page-title-bar></page-title-bar>
        <v-container fluid grid-list-xl py-0>

            <app-card
                    :heading="$t('message.addNewSiteLabel')"
                    customClasses="mb-30"
            >
                <v-form v-model="form2.valid" ref="form" lazy-validation>
                    <v-text-field
                            label="Site Domain"
                            v-model="form2.formData.siteName"
                            :rules="form2.domainNameRules"
                            :counter="10"
                            required
                    ></v-text-field>
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
                            @click="submit"
                            :disabled="!form2.valid"
                            color="success"
                    >
                        {{$t("message.add")}}
                    </v-btn>
                    <v-btn @click="clear" color="primary">{{$t("message.clear")}}</v-btn>
                </v-form>
            </app-card>
        </v-container>
    </div>
</template>

<script>
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

        methods: {
            submit() {
                if (this.$refs.form.validate()) {
                    this.$store.dispatch("addSite", this.form2.formData);
                    this.$refs.form.reset();
                }
            },
            clear() {
                this.$refs.form.reset();
            }
        }
    };
</script>
