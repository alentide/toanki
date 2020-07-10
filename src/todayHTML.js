#!/usr/bin/env node
const path = require("path");
const fs = require("fs");
const USER_HOME = process.env.HOME || process.env.USERPROFILE;
const notesPath = path.resolve(USER_HOME, "DailyHTML");
const { execSync } = require("child_process");

// 打开文件
const openFile = function (filePath) {
    execSync(`start ${filePath}`);
};

//解析命令行参数
const yargs = require("yargs");
const { exec } = require("child_process");
main();

//主函数
function main() {
    //如果文件夹没有创建，则创建
    if (!fs.existsSync(notesPath)) {
        fs.mkdirSync(notesPath);
    }

    //获得今天的时间的各个部分
    const getToday = () => {
        const today = new Date();
        const Y = today.getFullYear();
        const M = today.getMonth() + 1;
        const D = today.getDate();
        const h = today.getHours();
        const m = today.getMinutes();
        const s = today.getSeconds();

        return [Y, M, D, h, m, s];
    };

    //获得存放今天HTML的文件夹名
    const getTodayFolderName = () => {
        const today = getToday();
        const Y = today[0];
        const M = (today[1] + "").padStart(2, "0");
        const D = (today[2] + "").padStart(2, "0");
        return `${Y}年${M}月${D}日`;
    };

    //获得存放今天HTML的文件夹的路径
    const getTodayFolderPath = () => {
        return path.resolve(notesPath, getTodayFolderName());
    };

    //如果今天的HTML文件夹没有创建，则创建
    if (!fs.existsSync(getTodayFolderPath())) {
        fs.mkdirSync(getTodayFolderPath());
    }

    // 创建文件index.html,js/,imgs/,css/

    //打开文件夹
    //打开文件vs
    const { execSync } = require("child_process");
    function openFileByVS(filePath) {
        if (typeof filePath === "object") {
            filePath.forEach((file) => {
                execSync(`code ${file}`);
            });
            return;
        }
        execSync(`code ${filePath}`);
    };
    openFileByVS(getTodayFolderPath());

    //获得HTML路径
    // const getNotePath = (fileName, ext = ".md") => {
    //     return path.resolve(getTodayFolderPath(), fileName) + ext;
    // };
}
