const {
    createReport
} = require('docx-templates');
const fsCb = require('fs');
const fs = fsCb.promises;
const path = require('path');
const template = fsCb.readFileSync(path.join(__dirname, './tpl.docx'));
module.exports = async function (output, text_options, img_options) {
    const buffer = await createReport({
        template,
        data: text_options,
        additionalJsContext: {
            // 返回的格式如下， res 是图片 base64 编码
            getMapPic() {
                // let res = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYBAMAAAASWSDLAAAAG1BMVEUAAAAzmf8zmf8zmf//6hf/1wKawoqZuICZuIL0iJrEAAAAA3RSTlMAfX7XWp9eAAAAbklEQVQY00XJ0QmAMBRD0acTCC5QcAINqAMUNxD91w3ECcS9rekLvV8Jx1gVrNQNZddAKACQHEgCksN4JBKcSyJBjKQMMZIcMjk4tcC9pjagtwqY/nMBjZEcjCQgvTsh0/wQnAgigoggIogIogwfHZ0imU9pmKUAAAAASUVORK5CYII=';
                // var base64Data = res.replace(/^data:image\/\w+;base64,/, "");
                // var dataBuffer = Buffer.from(base64Data, 'base64'); // 解码图片
                return img_options
            }
        },
        // 这个属性定义了模板中变量的边界，例如template.docx中插入变量就可以使用{ creator }
        cmdDelimiter: ['{', '}']
    });

    await fs.writeFile(output, buffer)
}