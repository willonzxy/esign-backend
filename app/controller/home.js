'use strict';
const dayjs = require('dayjs')
const Controller = require('egg').Controller;
const genDoc = require('../../docx-tpl-replacer.js');
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
    // var date = new Date().toLocaleDateString().split('/')
    return ctx.body = {
      code: 0,
      data: {
        ...info,
        date:dayjs().locale('zh-cn').format(`YYYY年M月D日`)
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
      if(!phone){
        return ctx.body = {
          code:-1,
          message:'参数非法，缺少手机号'
        }
      }
      // 查询提交记录,有提交就提示已提交
      let submit_info = await app.redis.get('submit_'+phone);
      if (submit_info) {
        return ctx.body = {
          code: -1,
          message: '您的签名信息已提交，无需重复提交',
          data: ''
        }
      }
      // 生成用户签名
      var img_path = path.join(__dirname,'../public/esign-img/',phone + '.png');
      var base64 = data.replace(/^data:image\/\w+;base64,/, ""); //去掉图片base64码前面部分data:image/png;base64
      var dataBuffer = Buffer.from(base64, 'base64'); //把base64码转成buffer对象，
      await fs.writeFile(img_path, dataBuffer);
      // 生成doc
      var info = app.user_info[phone];
      if(!info){
        return ctx.body = {
          code:-1,
          message:'系统缺少该商户信息，无法完成提交'
        }
      }
      var date = dayjs().locale('zh-cn').format(`YYYY年M月D日`);
      await genDoc(path.join(__dirname,'../public/esign-docx/',phone + '.docx'),{
        ...info,
        date,
      },{
        width:3.5,
        height:0.8,
        data:dataBuffer,
        extension:'.png'
      });
      await app.redis.set('submit_'+phone,'done');
      // 删除已提交的人员信息
      await app.redis.del(phone);
      ctx.body = {
        code:0,
        message:'提交成功'
      }
      ctx.logger.info(`submit_${phone}_${date}`);
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