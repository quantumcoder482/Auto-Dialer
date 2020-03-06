'use strict';

var app = require('../../server/server');
module.exports = function(Contacttype) {
  Contacttype.beforeRemote('**', function(context, unused, next) {
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
        Site.findOne({where: {and: [{postAvailable: {like: '_%1_%'}}, {siteName: originUrl}, {apiKey: apiKey}, {siteId: siteKey}]}}, function(err, sites) {
          if (sites == null || sites == undefined) {
            next(new Error('not authorized.'));
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
        let originUrl = context.req.headers.origin;
        Site.findOne({where: {and: [{postAvailable: {like: '_%1_%'}}, {siteName: originUrl}]}}, function(err, sites) {
          if (sites == null || sites == undefined) {
            next(new Error('not authorized.'));
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

        // else {
        //     if(accessToken != null){
        //         next();
        //     }
        //     else{
        //         const api_key = context.req.headers.hasOwnProperty('api_key') ? context.req.headers.api_key : null;
        //         const site_key = context.req.headers.hasOwnProperty('site_key') ? context.req.headers.site_key : null;
        //         if(api_key != null && site_key != null) {
        //             let originUrl = context.req.headers.origin;
        //             Site.findOne({where: {and: [{postAvailable: {like: '_%1_%'}}, {siteName: originUrl}, {apiKey: api_key}, {siteId: site_key}]}}, function (err, sites) {
        //                 if (sites == null || sites == undefined) {
        //                     next(new Error('not authorized.'));
        //                 } else {
        //                     context.req.body.source = originUrl;
        //                     context.req.body.sourceId = sites.id;
        //                     next();
        //                 }
        //             });
        //         } else {
        //             next(new Error('not provided auth token.'));
        //         }
        //     }
        // }
  });
};
