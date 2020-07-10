

function Note({ filePath }) {
    this = {
        __proto__: Note.prototype,
        filePath,
    };
}

Note.prototype = {
    constructor: Note,
    combine,
};

// TODO:读取目录下所有的md文件，如果文件名相同，就合并到一个文件中

function readDir(filePath) {
    const fs = require("fs");
    const filesList = fs.readdirSync(filePath);
    const allDirsfilesList = []
    filesList.forEach((file) => {
        const stats = fs.statSync(file);
        const isDirectory = stats.isDirectory();
        if (isDirectory) {
            allDirsfilesList.push(...readDir(file))
        }else {
            allDirsfilesList.push(file)
        }
    });
    return allDirsfilesList
}
