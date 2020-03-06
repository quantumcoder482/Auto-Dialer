/**
 * Contacts Module
 */
import Vue from 'vue'
const state = {
  contacts: null
}

const getters = {
  contactById: state => id => {
    let contact = state.contacts.find(contact => contact.id === Number(id));
    return contact
  },
  contacts: state => {
    return state.contacts
  },

}

const actions = {
  async getContact(context, payload) {
    let contact = {},
      contactId = payload.contactId,
      token = localStorage.getItem('userSecret');

    try {
      let response = await Vue.axios.get(`${process.env.VUE_APP_SOURC_URL}/contacts/${contactId}/?access_token=${token}`)
      return contact = response;

    } catch (error) {
      // statements
      contact = error.response
      return contact;
    }
  },
  async getContacts(context, payload) {
    let contacts,
      contactDetails,
      token = localStorage.getItem('userSecret');

    try {

      contacts = await Vue.axios.get(`${process.env.VUE_APP_SOURC_URL}/contacts/?access_token=${token}`);


      for (let [key, obj] of contacts.data.entries()) {

        contactDetails = await context.dispatch('getContactDetails', {
          contactId: contacts.data[key].id,
          type: 'object'
        })
        // let userDetails = await Vue.axios.get(`${process.env.VUE_APP_SOURC_URL}/users/${users.data[key].id}/details/?access_token=${token}`)

        if (!Vue._.isEmpty(contactDetails.data)) {

          contacts.data[key]['details'] = contactDetails.data

        }
      }

      context.commit('ContactsSuccess', contacts.data);
      return contacts;

    } catch (error) {

      // context.commit('usersFailure');

      contacts = error.response
      return contacts;

    }
  },
  async getContactDetails(context, payload) {
    let response,
      contactDetails = {},
      contactId = payload.contactId,
      token = localStorage.getItem('userSecret'),
      type = payload.type;

    try {
      response = await Vue.axios.get(`${process.env.VUE_APP_SOURC_URL}/contacts/${contactId}/details/?access_token=${token}`);

      // returned value is an object
      if (type === 'object') {

        // set the userDetails object
        contactDetails = Vue._.omit(response, 'data')
        contactDetails.data = {}

        // loop through user details array
        Vue._.forEach(response.data, function (object, key) {
          let objectProperty = Vue._.pick(object, ['metaKey', 'metaValue'])

          // create userDetails object
          contactDetails.data[objectProperty.metaKey] = objectProperty.metaValue
        })

        return contactDetails; // Let the calling function know that http is done. You may send some data back

      } else {

        // return value as an array
        contactDetails = response

        return contactDetails; // Let the calling function know that http is done. You may send some data back
      }

      // console.log(usersDetails)
    } catch (error) {
      response = error.response
      return response;
    }

  }
}

const mutations = {
  ContactsSuccess(state, contacts) {
    state.contacts = contacts
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
