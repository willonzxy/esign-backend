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
    console.log(phone);
    // get execl info;
    if (!app.user_info[phone]) {
      return ctx.body = {
        code: -1,
        message: '对应信息不存在'
      }
    }
    // 返回列表信息
    var date = new Date().toLocaleDateString().split('/')
    return ctx.body = {
      code: 0,
      data: {
        ...app.user_info[phone],
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
      let submit_info = await fs.readFile(path.join(__dirname,'../../submit.json'));
      submit_info = JSON.parse(submit_info.toString());
      if (submit_info[phone]) {
        return ctx.body = {
          code: -1,
          message: '您的签名信息已提交，无需重复提交',
          data: ''
        }
      }
      var img_path = path.join(__dirname,'../../esign-img/',phone + '_' + '.png');
      var base64 = data.replace(/^data:image\/\w+;base64,/, ""); //去掉图片base64码前面部分data:image/png;base64
      var dataBuffer = Buffer.from(base64, 'base64'); //把base64码转成buffer对象，
      await fs.writeFile(img_path, dataBuffer);
      //
      let unsubmit_info = await fs.readFile(path.join(__dirname,'../../unsubmit.json'));
      unsubmit_info = JSON.parse(unsubmit_info.toString());
      submit_info[phone] = unsubmit_info[phone];

      // 已提交
      await fs.writeFile(path.join(__dirname,'../../submit.json'), JSON.stringify(submit_info, '', '\t'));
      // console.log(JSON.stringify(submit_info, '', '\t'))
      // 更新未记录提的人员信息
      delete unsubmit_info[phone];
      await fs.writeFile(path.join(__dirname,'../../unsubmit.json'), JSON.stringify(unsubmit_info, '', '\t'));
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