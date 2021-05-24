'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
const prefix = '/api'
module.exports = app => {
  const { router, controller } = app;
  router.get(prefix+'/', controller.home.index);
  router.get(prefix+'/get-info', controller.home.getInfo);
  router.post(prefix+'/submit', controller.home.submit);
};
