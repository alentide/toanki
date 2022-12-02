#!/usr/bin/env node
const path = require("path");
const fs = require("fs");
const USER_HOME = process.env.HOME || process.env.USERPROFILE;
const notesPath = path.resolve(USER_HOME, "DailyNotes");
const { execSync } = require("child_process");

// 打开文件
const openFile = function (filePath) {
    execSync(`start ${filePath}`);
};

//解析命令行参数
const yargs = require("yargs");
const { exec } = require("child_process");
const argv = yargs.alias("config", "c").boolean(["config"]).argv;

if (argv.config) {
    //仅打开配置文件
    openConfig();
} else {
    // 启动主函数
    main({
        openNote: true
    });
}

//主函数
function main({openNote}) {
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

    //获得存放今天笔记的文件夹名
    const getTodayFolderName = () => {
        const today = getToday();
        const Y = today[0];
        const M = (today[1] + "").padStart(2, "0");
        const D = (today[2] + "").padStart(2, "0");
        return `${Y}年${M}月${D}日`;
    };

    //获得存放今天笔记的文件夹的路径
    const getTodayFolderPath = () => {
        return path.resolve(notesPath, getTodayFolderName());
    };

    //如果今天的笔记文件夹没有创建，则创建
    if (!fs.existsSync(getTodayFolderPath())) {
        fs.mkdirSync(getTodayFolderPath());
    }

    //获得笔记模板
    //笔记的换行符
    let line = "\r\n\r\n";

    // 获得在每个文件中输入的字符
    const getNoteTemplate = ({ cardType, noteType, tag }) => {
        return `牌组类：${cardType}${line}笔记类：${noteType}${line}标签：${tag}${line}`;
    };

    //笔记配置文件地址
    const getConfigPath = () => {
        return path.resolve(notesPath, "config.json");
    };

    //获得要创建的笔记信息

    // 如果笔记配置文件不存在，则创建
    if (!fs.existsSync(getConfigPath())) {
        fs.writeFileSync(getConfigPath(), "{}");
    }

    // 获得笔记配置文件
    let config;
    try {
        config = JSON.parse(fs.readFileSync(getConfigPath(), "utf-8")) || {};
    } catch (err) {
        config = {
            noteTemplates: [],
        };
    }
    //获得笔记路径
    const getNotePath = (fileName, ext = ".md") => {
        return path.resolve(getTodayFolderPath(), fileName) + ext;
    };

    //获得模板
    const { noteTemplates } = config;

    //如果模板不存在，打开配置文件，要求用户输入
    if (!noteTemplates) {
        // fs.openSync(getConfigPath(),'rs+');
        openFile(getConfigPath());
        console.log(
            "请设置noteTemplates数组属性，每个元素包含fileName(没有扩展名),cardType（牌组名）,noteType（笔记类）,tag（标签）"
        );
        return;
    }

    //根据模板，循环创建文件
    noteTemplates.forEach((noteTemplate) => {
        //获得当前笔记预生成的字符串
        const template = getNoteTemplate(noteTemplate);
        if (!noteTemplate.fileName) {
            console.log(noteTemplate, "出现错误");
            return;
        }
        //判断文件是否已经存在，如果不存在，则创建
        if (!fs.existsSync(getNotePath(noteTemplate.fileName))) {
            //如果不使用，则不创建
            if (!noteTemplate.use) return;

            fs.writeFileSync(getNotePath(noteTemplate.fileName), template);
        }
    });

    //打开第一个笔记文件
    //改成打开JavaScript.md
    openNote && openFile(getNotePath('JavaScript'));

    //执行toanki命令
    const fileWatchContainer = require("./file/fileWatchContainer");
    const watchStore = require("./file/watchStore");
    const card = require("./card/index");

    //连接数据库
    require('./plugins/mongoose')()

    watchStore(notesPath, fileWatchContainer(card));

    //打开anki
    exec('"C:/Program Files/Anki/anki.exe"');

    //打开目录
    const learningDirPath = JSON.parse(fs.readFileSync(path.resolve(notesPath,'config.json'),'utf-8')).learningDir
    console.log('learningDirPath',learningDirPath)
    // openFile(learningDirPath)
}

//仅打开配置文件
function openConfig() {
    //笔记配置文件地址
    const getConfigPath = () => {
        return path.resolve(notesPath, "config.json");
    };

    openFile(getConfigPath());
}
