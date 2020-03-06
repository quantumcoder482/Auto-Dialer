<template>
   <v-flex :class="colClasses">
      <div class="app-card pa-4" :class="customClasses">
         <v-card-text class="fill-height">
            <v-layout column align-center justify-center fill-height>
                  <h3 class="fw-bold mb-1 display-3"><span v-if="currency !== undefined">$</span><countTo :startVal='0' :endVal="total" :duration='5000'></countTo></h3>
                  <p class="ma-0 fs-12 grey--text title fw-light"><i :class="icon"></i> {{heading}}</p>
            </v-layout>
         </v-card-text>
        <slot></slot>
      </div>
   </v-flex>
</template>
<script>
import countTo from "vue-count-to";
export default {
  props: ["heading", "total", "colClasses", "customClasses", "icon", "currency"],
  components: {
    countTo
  }
};
</script>
