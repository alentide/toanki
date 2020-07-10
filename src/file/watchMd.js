function watchMd(cb) {
    const path = require("path");

    const watch = require("./watch");
    watch(process.cwd(), function (filename) {
        //排除掉.~开头的md隐藏文件，
        if (
            filename.endsWith(".md") &&
            !path.parse(filename).base.startsWith(".~") &&
            !path.dirname(filename).endsWith("cmb")
        ) {
            cb(filename);
        } else {
            cb("");
        }
        // needWatchFilesList.push(filename)
    });
}

module.exports = watchMd;
