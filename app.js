// 读取excel文件
const ExcelJS = require('exceljs');
const fs = require('fs');
module.exports = app => {
    app.messenger.once('egg-ready', ()=>{
        const workbook = new ExcelJS.Workbook();
        workbook.xlsx.readFile('./info.xlsx').then(function () {
            var worksheet = workbook.getWorksheet(1); //获取第一个worksheet
            worksheet.eachRow(function (row, rowNumber) {
                // console.log('Row ' + rowNumber + ' = ' + JSON.stringify(row.values));
                if(rowNumber > 1){
                    let [nil,seq,storename,storeid,owner,ownerphone] = row.values;
                    !app.user_info && (app.user_info = {});
                    let info = {
                        seq,
                        storename,
                        storeid,
                        owner,
                        ownerphone
                    };
                    app.user_info[ownerphone] = info;
                    (function(phone,_info){
                        setTimeout(function(){
                            app.redis.set(phone,_info)
                        })
                    })(ownerphone,JSON.stringify(info));
                    
                }
            });
            // 未提交的人，转成json
            // !fs.existsSync('./unsubmit.json') && fs.writeFileSync('./unsubmit.json',JSON.stringify(app.user_info,'','\t'))
        });
    });
}