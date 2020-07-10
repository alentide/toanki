const path = require("path");
const copyImg = require("../file/copyImg");

module.exports = ({ line, meta }) => {
    const imgPath = line.match(/\](.+)/)[0].slice(2, -1);
    const imgName = path.basename(imgPath);
    let imgDir = [path.dirname(imgPath)]; //变为数组是为了方便运算
    if (!path.isAbsolute(imgDir[0])) {
        imgDir.unshift(path.dirname(meta.filePath));
    }
    copyImg(imgName, imgDir.join("/"), meta.ankiPath);
    let content = `<img src="anki-paste${imgName}" >`;
    return content;
    // inputLocation.push(content);
};
