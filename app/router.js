'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
const prefix = ''
module.exports = app => {
  const { router, controller } = app;
  router.get(prefix+'/', controller.home.index);
  router.get(prefix+'/log', controller.home.log);
  router.get(prefix+'/get-info', controller.home.getInfo);
  router.post(prefix+'/submit', controller.home.submit);
  router.get(prefix+'/cache', controller.home.cache);
};
