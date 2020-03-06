'use strict';

const app = require('../../server/server');
const utilities = require('../../server/utilities');
const loopback = require('loopback');
const phone = require('phone');
const _ = require('lodash');
// const requestPromise = require('request-promise');

module.exports = function(Contact) {
    // Contact.remoteMethod('insertContact', {
    //       accepts: { arg: 'data', type: 'object', http: { source: 'body' }},
    //       returns: {arg: 'data', type: 'object'}
    // });

    // Contact.insertContact = function(context, next) {

    //     console.log(Contact.app.models.px);

    //     // this is the method im trying to invoke
    //     Contact.app.models.px.insertLead(context, function(err, lead) {
    //         console.log(lead);
    //         console.log(err);
    //         return next(err, lead);
    //     });

    // }

  Contact.beforeRemote('**', function(context, unused, next) {
    let accessToken = context.req.accessToken ? context.req.accessToken.id : null;
    let Site = app.models.Site;
    if (accessToken == null) {
      if (!context.req.headers.site_key && !context.req.headers.api_key) {
        next(new Error('not provided proper site key and api key.'));
      } else if (!context.req.headers.site_key) {
        next(new Error('not provided proper site key '));
      } else if (!context.req.headers.api_key) {
        next(new Error('not provided proper api key.'));
      } else {
        const apiKey = context.req.headers.api_key;
        const siteKey = context.req.headers.site_key;
        let originUrl = context.req.headers.origin;
        // console.log(originUrl);

        Site.findOne({where: {and: [{postAvailable: {like: '_%1_%'}}, {siteName: originUrl}, {apiKey: apiKey}, {siteId: siteKey}]}}, function(err, sites) {
          if (sites == null || sites == undefined) {
            next(new Error('site not authorized.'));
          } else {
            if (context.req.route.methods.hasOwnProperty('post') || context.req.route.methods.hasOwnProperty('put') || context.req.route.methods.hasOwnProperty('patch')) {
              context.req.body.source = originUrl;
              context.req.body.sourceId = sites.id;
            }
            next();
          }
        });
      }
    } else {
      if (context.req.route.methods.hasOwnProperty('post') || context.req.route.methods.hasOwnProperty('put') || context.req.route.methods.hasOwnProperty('patch')) {
        let originUrl = context.req.headers.host;
        // eslint-disable-next-line max-len
        Site.findOne({where: {and: [{postAvailable: {like: '_%1_%'}}, {siteName: originUrl}]}}, function(err, sites) {
          if (sites == null || sites == undefined) {
            next(new Error('site not authorized.'));
          } else {
            context.req.body.source = context.req.headers.origin;
            context.req.body.sourceId = sites.id;
            next();
          }
        });
      } else {
        next();
      }
    }
  });


  Contact.afterRemote('**', function (context, modelInstance, next) {

    // Get Models
    const contact = app.models.contact;
    const px = app.models.px;
    const datalot = app.models.datalot;
    const contactType = app.models.contactType;
    const dialerQueue = app.models.dialerQueue;
    const user = app.models.user;
    const userDetails = app.models.userDetails;

    if (context.req.route.methods.hasOwnProperty('post') || context.req.route.methods.hasOwnProperty('put') || context.req.route.methods.hasOwnProperty('patch')){

      // Get Request Path
      let requestPath = context.req.route.path;

      if(requestPath ==='/'){

        let contactId = context.result.id;
        let phoneNumber = context.result.phone;
        let typeId = context.result.typeId;
        let firstName = context.result.firstName;
        let lastName = context.result.lastName;
        let email = context.result.email;

        // Check PhoneNumber Format
        let regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
        if (!regex.test(phoneNumber)) {
          let phoneNumberArr = phone(phoneNumber);
          phoneNumber = phoneNumberArr[0];
        }
        try {
          contactType.findById(typeId, function(err, contactTypes){
            if(err){
              console.log(err);
              next(new Error('can not find type name'));
            }
            if(contactTypes.typename === 'lead'){
              // Check available users (agents)
              userDetails.find({where:{and:[{metakey:'availableCall'},{metaValue:1}]}}, function(err, availableUsers){
                if(availableUsers.length>0){
                  // Create new dialer Queue
                  console.log('create new dialerqueue');
                  dialerQueue.create({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    contactId: contactId,
                    phone: phoneNumber,
                    createdAt: Date.now()
                  }, function(err, newQueue){
                    if(err){
                      console.log(err);
                      next(new Error('can not creat dialerQueue'));
                    }
                    console.log('added dialerQueue:', newQueue);
                    next();
                  });

                }else {
                  contact.upsert({id:contactId, status:'sell'}, function(err, returnedInstance){
                    if (err) {
                      console.log(err);
                      next(new Error('failed update contact data'));
                    } else {
                      console.log('updated contact Info', returnedInstance);
                      next();
                    }
                  });
                }
              });
            } else { next(); }
          });

        } catch(error){
          console.log(error);
          next(new Error('something error'))
        }

      }else{
        let contactId = context.req.params.id;
        let contactDetails = {};
        let postData = {};

        contact.findById(contactId, function(err, contactData){
          if(err){
            console.log(err);
            next(new Error('can not find contact data - contact details'));
          }else {
            if(contactData.status == 'sell'){
              if(context.result.length > 0){
                _.forEach(context.result, function(object, key){
                  contactDetails[object.metaKey] = object.metaValue;
                });
                postData = {
                  firstName: contactData.firstName,
                  lastName: contactData.lastName,
                  email: contactData.email,
                  phone: contactData.phone,
                  ...contactDetails
                }

                utilities.convertDatalotFormat(postData).then(res => {
                  // Sell to Datalot
                  datalot.insertLead(res, function(err, result){
                    if(err){
                      console.log(err);
                    } else {
                      utilities.sendEmailDatalot(result, postData);
                    }
                  });
                });

                utilities.convertPxFormat(postData).then(res => {
                  // Sell to PX
                  px.insertLead(res, function(err, result){
                    if(err){
                      console.log(err);
                    } else {
                      utilities.sendEmailPx(result)
                    }
                  });
                });
              }
            }
          }
        });

        next();
      }

    } else {
      next();
    }

  });


};
