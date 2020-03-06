<template>
	<div>
		<v-container fluid pt-0 grid-list-xl>
			<v-layout row justify-space-between align-center>
			  <v-flex>
			    <section-tooltip :title="$t('message.overview')" :tooltip="$t('message.dashboardOverview')"></section-tooltip>
			  </v-flex>
			  <v-flex xs2>
			    <v-overflow-btn
			      dark
			      background-color="primary"
	              :items="dateRangeItems"
	              item-value="value"
	              item-text="text"
	              hide-selected	             
	              v-model="dateRange"
	              label="Select Date Range"
	              return-object
	            ></v-overflow-btn>
			  </v-flex>
			</v-layout>
			<!-- Dash Cards -->
			<v-layout row wrap border-rad-sm overflow-hidden>
				<stats-card-v6
					colClasses="xl4 lg4 md4 sm6 xs12"
					:heading="$t('message.totalLeads')"
					:total="count"
					icon="zmdi zmdi-account-box-o"
				> 
				</stats-card-v6>
				<stats-card-v6
					colClasses="xl4 lg4 md4 sm6 xs12"
					:heading="$t('message.totalEarnings')"
					:total="revenue"
					icon="zmdi zmdi-money-box"
					currency
				>
				</stats-card-v6>
				<stats-card-v6
					colClasses="xl4 lg4 md4 sm6 xs12"
					:heading="$t('message.totalCost')"
					:total="cost"
					icon="zmdi zmdi-money-box"
					currency
				>
				</stats-card-v6>
			</v-layout>
			<!-- Sales -->
			<v-layout row wrap>
				<app-card
					:heading="$t('message.sales')"
					colClasses="xs12"
					customClasses="mb-0 sales-widget"
					:fullScreen="true"
					:reloadable="true"
					:closeable="true"
				>
					<sales class="mb-4" :height="320"></sales>	
					<v-layout class="cart-wrap hidden-xs-only pl-4">
						<v-flex d-custom-flex>
							<span class="mr-2"><i class="zmdi zmdi-shopping-cart-plus primary--text"></i></span>
							<p class="mb-0">
								<span class="d-block fs-14 fw-bold">2382</span>
								<span class="d-block fs-12 grey--text">Sales</span>
							</p>
						</v-flex>
						<v-flex d-custom-flex>
							<span class="mr-2"><i class="zmdi zmdi-eye success--text"></i></span>
							<p class="mb-0">
								<span class="d-block fs-14 fw-bold">53,255</span>
								<span class="d-block fs-12 grey--text">Views</span>
							</p>
						</v-flex>
						<v-flex d-custom-flex>
							<span class="mr-2"><i class="zmdi zmdi-equalizer error--text"></i></span>
							<p class="mb-0">
								<span class="d-block fs-14 fw-bold">$1,25,000</span>
								<span class="d-block fs-12 grey--text">Earned</span>
							</p>
						</v-flex>
					</v-layout>				
				</app-card>
			</v-layout>
			<v-layout row wrap>
				<!-- Shopping Cart -->
				<app-card
					colClasses="sm12 xs12"
					:heading="$t('message.recentOrders')"
					customClasses="mb-0"
					:fullBlock="true"
					:fullScreen="true"
					:reloadable="true"
					:closeable="true"
					:footer="true"
				>
					<recent-orders></recent-orders>
					<div slot="footer" class="justify-space-between footer-flex">
						<v-btn color="primary" small>{{$t('message.viewAll')}}</v-btn>
						<v-spacer></v-spacer>
						<span class="grey--text d-custom-flex align-items-center">
							<i class="zmdi zmdi-replay mr-2"></i>
							<span class="fs-12">{{$t('message.updated10MinAgo')}}</span>
						</span>
					</div>					
				</app-card>	
			</v-layout>
		</v-container>
	</div>
</template>

<script>
// charts component
import LineChartShadow from "Components/Charts/LineChartShadow";
import Sales from "Components/Charts/SalesChartV2";
import LineChartWithArea from "Components/Charts/LineChartWithArea";

// widgets
import RecentSale from "Components/Widgets/RecentSales";
import SupportRequest from "Components/Widgets/SupportRequestV2";
import ToDoList from "Components/Widgets/ToDoList";
import Invoice from "Components/Widgets/Invoice";
import RecentOrders from "Components/Widgets/RecentOrders";
import WeeklySales from "Components/Widgets/WeeklySales.vue";
import Reviews from "Components/Widgets/Reviews";
import SocialFeeds from "Components/Widgets/SocialFeeds";
import TopSelling from "Components/Widgets/TopSelling";
import NewPost from "Components/Widgets/AddNewBlog";
import BlogLayoutOne from "Components/Widgets/BlogLayoutOne";
import BlogLayoutFour from "Components/Widgets/BlogLayoutFour";
import CategorySale from "Components/Widgets/CategorySales";
import DeviceShare from "Components/Widgets/DeviceShare";

import { ChartConfig } from "Constants/chart-config";
import { mapState } from "vuex";

export default {
  components: {
    LineChartShadow,
    RecentSale,
    SupportRequest,
    Sales,
    ToDoList,
    Invoice,
    RecentOrders,
    CategorySale,
    LineChartWithArea,
    WeeklySales,
    Reviews,
    SocialFeeds,
    TopSelling,
    NewPost,
    BlogLayoutOne,
    BlogLayoutFour,
    DeviceShare
  },
  data() {
    return {
      dateRange: {text: 'Day', value: 'day'},
      dateRangeItems: [
      	{text: 'Day', value: 'day'}, 
      	{text: 'Month', value: 'month'}, 
      	{text: 'Year', value: 'year'}
      ],
      blog: {
        id: 3,
        thumbnail: "/static/img/blog-3.jpg",
        title: "lorem ipsum is simply dummy text",
        body:
          "Consectetur adipisicing elit. Ullam expedita, necessitatibus sit exercitationem aut quo quos inventore similique nulla minima distinctio illo iste dignissimos vero nostrum, magni pariatur delectus natus.",
        date: "1-jun-2018"
      },
      ChartConfig,
      labels: ["A", "B", "C", "D", "E", "F", "J", "K", "L", "M", "N", "P"],
      totalEarnings: [30, 50, 25, 55, 44, 60, 30, 20, 40, 20, 40, 44],
      onlineRevenue: [30, 50, 25, 55, 44, 60, 30, 20, 40, 20, 40, 44],
      newCustomers: [30, 50, 25, 55, 44, 60, 30, 20, 40, 20, 40, 44]
    };
  },
  created() {
    this.getStats('day')
  },
  computed:{
  	...mapState({
  	 	count: state => state.stats.count,
  	 	revenue: state => state.stats.revenue,
  	 	cost: state => state.stats.cost
  	 })
  },
  methods: {
  	getStats(dateRange) {
  		this.$store.dispatch('getLeadCount', {range: dateRange})
  		this.$store.dispatch('getLeadRevenue', {range: dateRange})
  		this.$store.dispatch('getLeadCost', {range: dateRange})
  	}
  },
  watch: {
  	'dateRange' (to, from) {
  		this.getStats(to.value)
  	}
  }

};
</script>
