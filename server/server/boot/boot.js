// default creation script on server boot
'use strict';

module.exports = function (app) {
  var User = app.models.user;
  var Role = app.models.Role;
  var RoleMapping = app.models.RoleMapping;
  var dispositonType = app.models['dispositionType'], contactType = app.models['contactType'];
  var userDetails = app.models['userDetails'];

  app.dataSources.mysql.autoupdate(null, function (err) {
    if (err) throw err;

    // find or create admin user

    User.findOrCreate({
        where: {
          email: 'gf@dynamicinnovations.io',
          username: 'follano',
        },
      }, {
        username: 'follano',
        email: 'gf@dynamicinnovations.io',
        password: '50urc3!',
        emailVerified: 1,
      },
      function (err, users) {
        if (err) throw err;

        console.log('Created users:', users);

        // find or create the admin role
        Role.findOrCreate({
          name: 'administrator',
        }, function (err, role) {
          if (err) throw err;
          console.log('Created role:', role);
          // make user an admin
          role.principals.create({
            principalType: RoleMapping.USER,
            principalId: users.id,
          }, function (err, principal) {
            if (err) throw err;
            console.log('Created principal:', principal);
          });
        });

        userDetails.findOrCreate({
          where:{
            userId: 1,
            metaKey: 'firstName'
          },
        },{
          userId: 1,
          metaKey: "firstName",
          metaValue: "Gerard"
        }, function(err, meta){
          if(err) throw err;
          console.log("Created firstName", meta)
        });

        userDetails.findOrCreate({
          where: {
            userId: 1,
            metaKey: 'lastName'
          },
        }, {
          userId: 1,
          metaKey: "lastName",
          metaValue: "Follano"
        }, function (err, meta) {
          if (err) throw err;
          console.log("Created firstName", meta)
        });

      });

    // find or create manager role
    Role.findOrCreate({
      name: 'manager',
    }, function (err, role) {
      if (err) throw err;
      console.log('Created role:', role);
    });

    // find or create the member role
    Role.findOrCreate({
      name: 'member',
    }, function (err, role) {
      if (err) throw err;
      console.log('Created role:', role);
    });

    // find of create the disposition type
    // initial disposition types
    const dispositionTypeArr = [{
      typename: "not_interested",
      description: "Not Interested"
    }, {
      typename: "no_answer",
      description: "No Answer"
    }, {
      typename: "call_back",
      description: "Call Back"
    }, {
      typename: "customer_sevice",
      description: "Customer Service"
    }, {
      typename: "cancellation",
      description: "Cancellation"
    }, {
      typename: "sold",
      description: "Sold"
    }];

    asyncForEach(dispositionTypeArr, async (d) => {
      await runQuery(dispositonType, d);
    });

    // find or create contact types
    const contactTypeArr = [
      {
        typename: "lead",
        description: "lead type"
      },
      {
        typename: "general",
        description: "general type"
      },
      {
        typename: "customer",
        description: "customer type"
      }
    ];

    asyncForEach(contactTypeArr, async (d) => {
      await runQuery(contactType, d);
    });

    async function asyncForEach(array, callback) {
      for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
      }
    }

    function runQuery(model, data) {
      return new Promise(function (resolve, reject) {
        model.findOrCreate({
          where: {
            typename: data.typename,
            description: data.description
          },
        }, {
          typename: data.typename,
          description: data.description
        }, function (err, dt) {
          if (err) throw err;
          console.log('Created dispositionData: ', dt);
          resolve(dt);
        });
      });
    }

  });
};
