'use strict';

let app = require('../../server/server.js');
module.exports = function(user) {
    // User.beforeRemote()
    // send verification email after registration
    // user.beforeRemote('**', function(context, unused, next) {
    //     let Site = app.models.Site;
    //     if (context.req.route.methods.hasOwnProperty('patch') && context.req.route.methods.patch){
    //         let originUrl = context.req.headers.origin.split('//')[1];
    //         Site.findOne({where: {and: [{postAvailable: {like: '1_%_%'}}, {siteName: originUrl}]}}, function(err, sites) {
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
  user.afterRemote('create', function(context, userInstance, next) {
        // vars
    let Role = app.models.Role;
    let RoleMapping = app.models.RoleMapping;

    console.log('> user.afterRemote triggered');

    var options = {
      type: 'email',
      to: userInstance.email,
      from: 'gf@dynamicinnovations.io',
      subject: 'Please confirm your email',
      templateFn: function(options, cb) {
        cb(null, userInstance.token);
      },
      redirect: 'http://localhost:8080/session/login?verification=successful',
      user: user,
    };

    userInstance.verify(options, function(err, response, next) {
      if (err) return next(err);

      console.log('> verification email sent:', response);

            // context.res.render('response', {
            //   title: 'Signed up successfully',
            //   content: 'Please check your email and click on the verification link ' -
            //       'before logging in.',
            //   redirectTo: '/',
            //   redirectToLinkText: 'Log in'
            // });
    });

    Role.find({where: {name: 'member'}}, function(err, role) {
      if (err) {
        return err;
      }

      RoleMapping.create({
        principalType: RoleMapping.USER,
        principalId: userInstance.id,
        roleId: role[0].id,
      }, function(err, roleMapping) {
        if (err) throw err;
        console.log('User assigned RoleID: ' + role[0].id + ' (userId: ' + userInstance.id + ')');
      });
    });

    next();
  });

  user.on('resetPasswordRequest', function(userInstance, next) {
    console.log(userInstance);
    user.app.models.Email.send({
      to: userInstance.email,
      from: 'gf@dynamicinnovations.io',
      subject: 'Password reset request',
      html: 'http://localhost:8080/session/reset-password/?token=' + userInstance.accessToken.id,
    }, function(err) {
      if (err) return console.log('> error sending password reset email');
      console.log('> sending password reset email to:', userInstance.email);
    });

    next();
  });

    // Method to render
    // User.afterRemote('prototype.verify', function(context, user, next) {
    // 	context.res.render('response', {
    // 	  title: 'A Link to reverify your identity has been sent '+
    // 	    'to your email successfully',
    // 	  content: 'Please check your email and click on the verification link '+
    // 	    'before logging in',
    // 	  redirectTo: '/',
    // 	  redirectToLinkText: 'Log in'
    // 	});
    // });
};
