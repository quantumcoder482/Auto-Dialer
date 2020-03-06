'use strict';
var app = require('../../server/server');
module.exports = function(Site) {
  // Site.beforeRemote('**', function(context, unused, next) {
  //
  //     // let Site = app.models.Site;
  //     if (context.req.route.methods.hasOwnProperty('post') && context.req.route.methods.post){
  //         const apiKey = context.req.body.site_key;
  //         let originUrl = context.req.headers.origin.split('//')[1];
  //         Site.findOne({where: {and: [{postAvailable: {like: '_%_%1'}}, {siteName: originUrl}]}}, function(err, sites) {
  //             if(sites == null || sites == undefined) {
  //                 next(new Error('not authorized.'));
  //             } else {
  //                 next();
  //             }
  //         });
  //     } else {
  //         next();
  //     }
  // });
};
