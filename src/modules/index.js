import {execSync} from 'child_process'
// const { execSync } = require("child_process");
// 打开文件
export const openFile = function (filePath) {
    execSync(`start ${filePath}`);
};