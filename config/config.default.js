/* eslint valid-jsdoc: "off" */

'use strict';
const path = require('path');
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1621821189932_4388';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    bodyParser:{
      jsonLimit:'1024mb',
    },
    multipart:{
      fileExtensions:['.ico','.wav','.apk','.dmg'], // 为让egg支持更多上传文件后缀名
      fileSize: '1024mb'
    },
    security:{
      csrf: {
        enable:false
      }
    },
    logger:{
      dir:path.resolve(__dirname,'../logs/esgin'),
      consoleLevel: 'NONE',
    },
    redis:{
      client:{
        port:6379,
        host:'127.0.0.1',
        password:'0887910',
        db:0
      }
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
