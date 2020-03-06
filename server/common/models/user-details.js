'use strict';

module.exports = function(Userdetails) {
  Userdetails.beforeRemote('createUpdates', function(ctx, modelInstance, next) {
    console.log(ctx);
    console.log(modelInstance);
    next();
  });
};
