'use strict';

const Controller = require('egg').Controller;
// const fs = require('fs').promises;
const fsCb = require('fs');
const fs = fsCb.promises;
const path = require('path');
class HomeController extends Controller {
  async index() {
    const {
      ctx
    } = this;
    ctx.body = 'hi, egg';
  }
  // 获取商户信息
  async getInfo() {
    const {
      ctx,
      app
    } = this;
    const {
      phone
    } = ctx.query;
    // get execl info;
    // let info = await app.redis.get(phone);
    let info = app.user_info[phone];
    if (!info) {  
      return ctx.body = {
        code: -1,
        message: '对应信息不存在'
      }
    }
    // info = JSON.parse(info);
    // 返回列表信息
    var date = new Date().toLocaleDateString().split('/')
    return ctx.body = {
      code: 0,
      data: {
        ...info,
        date:`${date[0]}年${date[1]}月${date[2]}日`
      }
    }
  }
  // 上传签名表格
  async submit() {
    const {
      ctx,
      app
    } = this;
    const {
      phone,
      data
    } = ctx.request.body;
    // 保存图片
    try {
      // 查询提交记录,有提交就提示已提交
      let submit_info = await app.redis.get('submit_'+phone);
      submit_info && (submit_info = JSON.parse(submit_info));
      if (submit_info[phone]) {
        return ctx.body = {
          code: -1,
          message: '您的签名信息已提交，无需重复提交',
          data: ''
        }
      }
      var img_path = path.join(__dirname,'../public/esign-img/',phone + '.png');
      var base64 = data.replace(/^data:image\/\w+;base64,/, ""); //去掉图片base64码前面部分data:image/png;base64
      var dataBuffer = Buffer.from(base64, 'base64'); //把base64码转成buffer对象，
      await fs.writeFile(img_path, dataBuffer);
      await app.redis.set('submit_'+phone,'done');
      // 删除已提交的人员信息
      await app.redis.del(phone);
      ctx.body = {
        code:0,
        message:'提交成功'
      }
    } catch (error) {
      ctx.body = {
        code:-1,
        message:error.message
      }
    }
  }
  async log(){
    const {
      ctx
    } = this;
    ctx.logger.info(JSON.stringify(ctx.query,'','\t'));
    ctx.body = {
      code:0
    }
  }
}

module.exports = HomeController;