<template>
  <div class="session-wrapper">
    <div class="session-left">
        <session-slider-widget></session-slider-widget>
    </div>
    <div class="session-right text-xs-center">
        <div class="session-table-cell">
        		<div class="session-content">
					<img 
						:src="appLogo"
						class="img-responsive mb-3" 
						width="250" 
					/>
					<h2 class="mb-3">{{$t('message.forgotPassword')}}</h2>
					<p class="fs-14">{{$t('message.enterYourEmailToSendYouAResetLink')}}.</p>
					<v-form v-model="valid" class="mb-4" ref="form">
							<v-text-field 
							label="Email" 
							v-model="email" 
							:rules="emailRules" 
							required
						></v-text-field>						
						<v-btn color="primary" block @click="submit" class="mt-3" large>Send Email</v-btn>
					</v-form>
					<div>
						<router-link to="/session/login">{{$t('message.backToSignIn')}}</router-link>
					</div>
				</div>
			</div>
		</div>
  </div>
</template>


<script>
import SessionSliderWidget from "Components/Widgets/SessionSlider";
import AppConfig from "Constants/AppConfig";

export default {
  components: {
    SessionSliderWidget
  },
  data() {
    return {
	  email: '',
      valid: false,
	  emailRules: [
        v => !!v || "E-mail is required",
        v =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "E-mail must be valid"
      ],
      appLogo: AppConfig.appLogo2
    };
  }, 
  methods: {
  	submit() {
  	  if (this.$refs.form.validate()) {
		const userDetails = {
			email: this.email,
		};
		this.$store.dispatch("resetUserInLoopback", {
			userDetails
		});
  	  }
  	},
  }
};
</script>
