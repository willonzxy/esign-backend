// 读取excel文件
const ExcelJS = require('exceljs');
module.exports = app => {
    app.messenger.once('egg-ready', ()=>{
        !app.user_info && (app.user_info = {});
        const workbook = new ExcelJS.Workbook();
        workbook.xlsx.readFile('./info.xlsx').then(function () {
            var worksheet = workbook.getWorksheet(1); //获取第一个worksheet
            // var num = 0;
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
                    // num++
                    (function(phone,_info){
                        setTimeout(function(){
                            app.redis.set(phone,_info)
                        })
                    })(ownerphone,JSON.stringify(info));
                    
                }
            });
            // console.log(num)
        }).catch(e=>{
            console.log(e);
        })
    });
}