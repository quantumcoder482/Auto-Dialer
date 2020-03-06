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
						width="200"
					/>
					<h2 class="mb-3">{{$t('message.resetPassword')}}</h2>
					<p class="fs-14">{{$t('message.pleaseEnterYourPasswordToReset')}}.</p>
					<v-form v-model="valid" class="mb-4" ref="form">
						<v-text-field 
							label="New Password" 
							v-model="newPassword" 
							type="password" 
							:rules="passwordRules" 
							required
						></v-text-field>
						<v-text-field 
							label="Confirm Password" 
							v-model="confirmPassword" 
							type="password"  
							required
							:rules="confirmPasswordRules" 
							validate-on-blur
						></v-text-field>
						<v-btn large @click="submit" block color="primary">{{$t('message.resetPassword')}}</v-btn>
					</v-form>
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
      valid: false,
      newPassword: "",
      confirmPassword: '',
	  passwordRules: [v => !!v || "Password is required"],
	  confirmPasswordRules: [v => v === this.newPassword  || "Password must match"],
      appLogo: AppConfig.appLogo2
    };
  },
  methods: {
  	passwordMatchError () { 
  	  if(this.confirmPassword) {
  	    return (this.newPassword === this.confirmPassword) ? '' : 'passwords must match'
  	  }
  	},
    submit() {
    	if (this.$refs.form.validate()) {
	      const userDetails = {
	      	token: this.$router.currentRoute.query.token,
	      	newPassword: this.newPassword
	      };
	      this.$store.dispatch("resetUserPasswordInLoopback", {
	        userDetails
	      });
  		}
    }
  }
};
</script>
