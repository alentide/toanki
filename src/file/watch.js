const fs = require("fs");
const path = require("path");

const canNotOperate = [];

const armDB = [];

function watchFile(filePath, cb) {
    var watch = require("node-watch");

    //不可操作的文件列表
    const canNotOperateFilesList = [];

    watch(filePath, { recursive: true }, function (evt, name) {
        //如果已经记录该文件不可操作就直接返回
        if (canNotOperateFilesList.find((item) => item === name)) return;
        fs.access(name, fs.R_OK | fs.W_OK, function (err) {
            if (err) {
                canNotOperateFilesList.push(name);
                return;
            }
            cb && cb(name);
        });
    });
}
module.exports = watchFile;
