const watchMd = require("./watchMd.js");

function unique(arr) {
    return Array.from(new Set(arr));
}

const { sync } = require("../http/api");

function fileWatchContainer(makeCard) {
    const filesList = [];
    const lastFilesList = [];
    let armDB = []; //内存数据库
    let free = true;

    let timer;

    function debounce() {
        timer = setTimeout(() => {
            if (!free) {
                debounce();
            } else {
                free = false;
                const tempList = filesList.map((c) => c);
                filesList.splice(0);
                console.log("");
                console.log("");
                console.log("");
                console.log("开始读取以下文件==============================");
                console.log(tempList);
                makeCard(tempList, armDB, async (needSync) => {
                    if (!needSync) {
                        console.log("本次任务未发现变动，无需同步");
                    }else{
                        // const syncResult = await sync();
                        console.log('因暂停同步功能，取消同步')
                        // if (!syncResult.result) {
                        //     console.log("同步成功");
                        // }
                        
                    }

                    free = true;
                    const date = new Date();
                    const y = date.getFullYear();
                    const m = (date.getMonth() + 1 + "").padStart(2, 0);
                    const d = ("" + date.getDate()).padStart(2, 0);
                    const h = ("" + date.getHours()).padStart(2, 0);
                    const min = ("" + date.getMinutes()).padStart(2, 0);
                    const s = ("" + date.getSeconds()).padStart(2, 0);
                    console.log(
                        `本次更新结束时间：${y}年${m}月${d}日${h}：${min}：${s}`
                    );
                });
            }
        }, 5000);
    }

    return (filename) => {
        if (filename) {
            filesList.push(filename);
            filesList.splice(0, filesList.length, ...unique(filesList));
            clearTimeout(timer);
            debounce();
        }
    };
}

module.exports = fileWatchContainer;

// watchMd(fileWatchContainer(makeCard));

// function makeCard(filesList,cb) {
//     console.log(filesList)
//     let i = 0;
//     let cardTimer = setInterval(() => {
//         i++;
//         if (i < 10) {
//             console.log("正在制卡",i);
//         } else {
//             console.log("制卡完毕");
//             clearInterval(cardTimer)
//             cb()
//         }
//     }, 1000);
// }
