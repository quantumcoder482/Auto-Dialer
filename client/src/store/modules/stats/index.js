/**
 * Stats Module
 */
import Vue from 'vue';
import moment from 'moment';
const state = {
    count: null,
    revenue: null,
    cost: null
}

const getters = {

}

const actions = {
    async getLeadCount(context, payload) {
        // set initial vars
        let response,
            range = (typeof payload !== 'undefined' && typeof payload.range !== 'undefined' ) ? payload.range : 'day',
            dateRange,
            token = localStorage.getItem('userSecret');

        // if range is (day, month, year) set the current date minus (day, month, or year)
        switch(range) {
            case 'month':
                // month
                dateRange = moment().subtract(1, 'months').format('L');
                break;
            case 'year':
                // year
                dateRange = moment().subtract(1, 'years').format('L');
                break;
            default:
                // day
                dateRange = moment().format('L');
                break;
         };

         // response from server
        response = await Vue.axios.get(`${process.env.VUE_APP_SOURC_URL}/contacts/count/?access_token=${token}`, { params: {  where: { createdAt: {gt: dateRange } } } });

        context.commit('Success', response.data);
    },
    async getLeadRevenue(context, payload) {
         // set initial vars
        let response,
            leadRevenue = 0,
            range = (typeof payload !== 'undefined' && typeof payload.range !== 'undefined' ) ? payload.range : 'day',
            dateRange,
            token = localStorage.getItem('userSecret');

        // if range is (day, month, year) set the current date minus (day, month, or year)
        switch(range) {
            case 'month':
                // month
                dateRange = moment().subtract(1, 'months').format('L');
                break;
            case 'year':
                // year
                dateRange = moment().subtract(1, 'years').format('L');
                break;
            default:
                // day
                dateRange = moment().format('L');
                break;
        };

        // response from server
        response = await Vue.axios.get(`${process.env.VUE_APP_SOURC_URL}/contacts/?access_token=${token}`, { params: { filter: { where: { createdAt: {gt: dateRange}},  include: {relation: 'details', scope: {where: { metaKey : 'revenue' }}} }}});

        // context.commit('Success', response.data);
        Vue._.forEach(response.data, function(object, key) {
            // console.log(object)
            if(!Vue._.isEmpty(object['details'])) {

                Vue._.forEach(object['details'], function(arrayObject, key) {
                        leadRevenue += Number(arrayObject['metaValue'])
                })

            }
        })

        context.commit('Success', {revenue: leadRevenue })

    },
    async getLeadCost(context, payload) {
         // set initial vars
        let response,
            leadCost = 0,
            range = (typeof payload !== 'undefined' && typeof payload.range !== 'undefined' ) ? payload.range : 'day',
            dateRange,
            token = localStorage.getItem('userSecret');

        // if range is (day, month, year) set the current date minus (day, month, or year)
        switch(range) {
            case 'month':
                // month
                dateRange = moment().subtract(1, 'months').format('L');
                break;
            case 'year':
                // year
                dateRange = moment().subtract(1, 'years').format('L');
                break;
            default:
                // day
                dateRange = moment().format('L');
                break;
        };

        // Response from server
        response = await Vue.axios.get(`${process.env.VUE_APP_SOURC_URL}/contacts/?access_token=${token}`, { params: { filter: { where: { createdAt: {gt: dateRange}},  include: {relation: 'details', scope: {where: { metaKey : 'cost' }}} }}});

        // context.commit('Success', response.data);
        Vue._.forEach(response.data, function(object, key) {
            // console.log(object)
            if(!Vue._.isEmpty(object['details'])) {

                Vue._.forEach(object['details'], function(arrayObject, key) {
                        leadCost += Number(arrayObject['metaValue'])
                })

            }
        })

        context.commit('Success', {cost: leadCost })

    }
}

const mutations = {
    Success(state, payload) {
        // get payload keys
        let key = Object.keys(payload);
        // set state to key and its value
        return state[key] = payload[key];
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}