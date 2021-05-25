'use strict';

/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  static: {
    enable: true,
  },
  security:{
    csrf: {
        enable:false
    }
  },
  redis:{
    enable:true,
    package:'egg-redis'
  },
};
