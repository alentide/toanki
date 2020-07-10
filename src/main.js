#!/usr/bin/env node

const line = "\r\n\r\n";

const yargs = require("yargs");
const path = require("path");
const fs = require("fs");
const shelves = [];
let isShelve = false;

const argv = yargs.alias("cmb", "c").boolean(["cmb"]).argv;
if (argv.cmb) {
    delDir("./cmb");
    if (!fs.existsSync("./cmb")) {
        fs.mkdirSync("./cmb");
    }

    const filesList = readDir("./");

    filesList.forEach((file) => {
        const originContent = fs.readFileSync(file).toString();
        const originContentLines = originContent.split(line);
        // if(originContentLines.length===3) return
        const restLines = originContentLines.slice(3);
        if (!restLines.some((line) => line)) return;
        restLines.forEach((line, i) => {
            line = line.trim();
            if (line.startsWith("![")) {
                const imgPath = line.match(/\](.+)/)[0].slice(2, -1);
                // const imgName = path.basename(imgPath);
                line =
                    line.split(imgPath)[0] +
                    path.resolve(path.dirname(file), imgPath) +
                    ")]";
                restLines.splice(i, 1, line);
                // console.log(line);
                // return;
            }

            // 判断是否是搁置
            if (isShelve || line.startsWith("## 搁置：")) {
                shelves.push(line);
                isShelve = true;

                if (line.startsWith("=====搁置内容结束=====")) {
                    isShelve = false;
                }
            }
        });
        const title = "# " + path.dirname(file).split("\\").slice(-1)[0];

        const restContent = restLines.join(line);
        const content = title + line + restContent;
        fs.appendFileSync(`./cmb/${path.basename(file)}`, content);
    });
    fs.writeFileSync(`./cmb/搁置.md`, shelves.join(line));
} else {
    const fileWatchContainer = require("./file/fileWatchContainer");
    const watchMd = require("./file/watchMd");
    const card = require("./card/index");

    watchMd(fileWatchContainer(card));
}

function readDir(filePath, ext = ".md") {
    const filesList = fs.readdirSync(filePath);
    const allDirsfilesList = [];
    filesList.forEach((file) => {
        const currentFilePath = path.resolve(filePath, file);
        const stats = fs.statSync(currentFilePath);
        const isDirectory = stats.isDirectory();

        const dir = path.resolve(filePath, currentFilePath);
        if (isDirectory) {
            allDirsfilesList.push(...readDir(dir));
        } else if (currentFilePath.endsWith(ext)) {
            allDirsfilesList.push(currentFilePath);
        }
    });
    return allDirsfilesList;
}

function delDir(path) {
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach((file, index) => {
            let curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                delDir(curPath); //递归删除文件夹
            } else {
                fs.unlinkSync(curPath); //删除文件
            }
        });
        fs.rmdirSync(path);
    }
}
