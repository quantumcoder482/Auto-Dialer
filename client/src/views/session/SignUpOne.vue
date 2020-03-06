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
					<h2 class="mb-3">{{$t('message.signUp')}}</h2>
					<p class="fs-14">{{$t('message.havingAnAccount')}}
						<router-link to="/session/login">{{$t('message.login')}}</router-link>
					</p>
					<v-form v-model="valid" class="mb-4" ref="form">
						<v-text-field 
							label="Username" 
							v-model="name" 
							:rules="nameRules" 
							:counter="20" 
							required
						></v-text-field>
						<v-text-field 
							label="Email" 
							v-model="email" 
							:rules="emailRules" 
							required
						></v-text-field>
						<v-text-field 
							label="Password" 
							v-model="password" 
							:rules="passwordRules" 
							type="password" 
							required
						></v-text-field>
						<v-btn @click="submit" block color="primary" class="mt-3" large>{{$t('message.signUp')}}</v-btn>
						<p>{{$t('message.bySigningUpYouAgreeTo')}} {{brand}}</p>
						<router-link to="">{{$t('message.termsOfService')}}</router-link>
					</v-form>
					<!-- <div class="session-social-links d-inline-block">
						<ul class="list-inline">
							<li @click="signInWithFacebook">
								<span class="facebook-bg session-icon">
									<i class="ti-facebook"></i>
								</span>
							</li>
							<li @click="signInWithGoogle">
								<span class="google-bg session-icon">
									<i class="ti-google"></i>
								</span>
							</li>
							<li @click="signInWithTwitter">
								<span class="twitter-bg session-icon">
									<i class="ti-twitter-alt"></i>
								</span>
							</li>
							<li @click="signInWithGithub">
								<span class="github-bg session-icon">
									<i class="ti-github"></i>
								</span>
							</li>
						</ul>
					</div> -->
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
      name: "",
      nameRules: [
        v => !!v || "Name is required",
        v => v.length <= 20 || "Name must be less than 20 characters"
      ],
      email: "",
      emailRules: [
        v => !!v || "Email is required",
        v =>
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "Email must be valid"
      ],
      password: "",
      passwordRules: [v => !!v || "Password is required"],
      appLogo: AppConfig.appLogo2,
      brand: AppConfig.brand
    };
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        let userDetails = {
          username: this.name,
          email: this.email,
          password: this.password,
          emailVerified: true
        };
        this.$store.dispatch("signUpUserInLoopback", {
          userDetails,
          router: this.$router
        });
      }
    },
    signInWithFacebook() {
      this.$store.dispatch("signinUserWithFacebook", {
        router: this.$router
      });
    },
    signInWithGoogle() {
      this.$store.dispatch("signinUserWithGoogle", {
        router: this.$router
      });
    },
    signInWithTwitter() {
      this.$store.dispatch("signinUserWithTwitter", {
        router: this.$router
      });
    },
    signInWithGithub() {
      this.$store.dispatch("signinUserWithGithub", {
        router: this.$router
      });
    }
  }
};
</script>
