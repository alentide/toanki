const getFileContentByLine = require("../file/read");

const path = require("path");
const copyImg = require("../file/copyImg");
const getImgCon = require("./getImgCon");
const {filePath,user} = require('../../config')
const meta = {
    user,
    tags: [],
    level2: "",
    level3: "",
    level4: "",
    level5: "",
    level6: "",
    deleted: false,
    get ankiPath() {
        return (
            filePath+
            user +
            "/collection.media"
        );
    },
    deleteMany: false,
};

function toImgCon(card) {
    const newSteps = card.step.map((step) => {
        return step.replace(/!\[.*?\]\(.+?\)/g, (str) =>
            getImgTagCon(str, card)
        );
    });
    card.step.length = 0;
    card.step.push(...newSteps);

    const newDetails = card.detail.map((step) => {
        return step.replace(/!\[.*?\]\(.+?\)/g, (str) =>
            getImgTagCon(str, card)
        );
    });

    card.detail.length = 0;
    card.detail.push(...newDetails);
}

function strToImgCon(step, card) {
    return step.replace(/!\[.*?\]\(.+?\)/g, (str) => getImgTagCon(str, card));
}
function getImgTagCon(str, card) {
    const imgPath = str.match(/\](.+)/)[0].slice(2, -1);
    const imgName = path.basename(imgPath);
    let imgDir = [path.dirname(imgPath)]; //变为数组是为了方便运算
    if (!path.isAbsolute(imgDir[0])) {
        imgDir.unshift(path.dirname(card.filePath));
    }
    copyImg(imgName, imgDir.join("/"), meta.ankiPath);
    return `<div> <img src="anki-paste${imgName}" > </div>`;
}

module.exports = async function (filesList, armDB, cb) {
    const cards = [];
    // const parses = [getUser, getStep, getDetail, getTag];

    let inputLocation;

    function Card({ index, deckName, modelName, tags, filePath, deleted }) {
        this.step = [];
        this.detail = [];
        this.index = index;
        this.deckName = deckName;
        this.modelName = modelName;
        this.tags = tags.map((c) => c);
        this.filePath = filePath;
        this.deleted = deleted;
    }

    filesList.forEach((file) => {
        const fileContentByLine = getFileContentByLine(file);

        fileContentByLine.forEach((line) => {
            if (line.startsWith("牌组类：")) {
                meta.deckName = line.split("牌组类：")[1];
            } else if (line.startsWith("用户：")) {
                meta.user = line.split("用户：")[1];
            } else if (line.startsWith("笔记类：")) {
                meta.modelName = line.split("笔记类：")[1];
            } else if (line.startsWith("标签：")) {
                const tags = line.split("标签：")[1].split(" ");
                const tempTags = [];
                let replaceTags = false;
                tags.forEach((tag, i) => {
                    if (tag.startsWith("-")) {
                        const realTag = tag.substring(1);
                        meta.tags.splice(
                            meta.tags.findIndex((item) => item === realTag),
                            1
                        );
                    } else if (tag.startsWith("+")) {
                        meta.tags.push(tag.substring(1));
                    } else {
                        replaceTags = true;
                        tempTags.push(tag);
                    }
                });
                if (replaceTags) {
                    meta.tags = tempTags;
                }
            } else if (line.startsWith("操作：批量删除卡片")) {
                meta.deleteMany = true;
            } else if (line.startsWith("操作：停止批量删除")) {
                meta.deleteMany = false;
            } else if (line.startsWith("序号：")) {
                const index = line.split("序号：")[1];
                if (index.startsWith("d")) {
                    meta.deleted = true;
                    meta.index = index.substring(1);
                } else if (meta.deleteMany) {
                    meta.deleted = true;
                    meta.index = index;
                } else {
                    meta.deleted = false;
                    meta.index = line.split("序号：")[1];
                }

                meta.filePath = file;
            } else if (line.startsWith("## s1：")) {
                const card = new Card(meta);
                card.level = 2;
                card.step.push(line.split("## s1：")[1]);
                cards.push(card);
                inputLocation = cards[cards.length - 1].step;
                meta.level2 = cards[cards.length - 1];
            } else if (line.startsWith("### s2：")) {
                const card = new Card(meta);
                card.level = 3;
                card.step.push(line.split("### s2：")[1]);
                cards.push(card);
                inputLocation = cards[cards.length - 1].step;
                meta.level3 = cards[cards.length - 1];
                card.parentIndex = meta.level2.index;
                card.parentCard = meta.level2;
            } else if (line.startsWith("#### s3：")) {
                const card = new Card(meta);
                card.level = 4;
                card.step.push(line.split("#### s3：")[1]);
                cards.push(card);
                inputLocation = cards[cards.length - 1].step;
                meta.level4 = cards[cards.length - 1];
                card.parentIndex = meta.level3.index;
                card.parentCard = meta.level3;
            } else if (line.startsWith("##### s4：")) {
                const card = new Card(meta);
                card.level = 5;
                card.step.push(line.split("##### s4：")[1]);
                cards.push(card);
                inputLocation = cards[cards.length - 1].step;
                meta.level5 = cards[cards.length - 1];
                card.parentIndex = meta.level4.index;
                card.parentCard = meta.level4;
            } else if (line.startsWith("###### s5：")) {
                const card = new Card(meta);
                card.level = 6;
                card.step.push(line.split("###### s5：")[1]);
                cards.push(card);
                inputLocation = cards[cards.length - 1].step;
                meta.level6 = cards[cards.length - 1];
                card.parentIndex = meta.level5.index;
                card.parentCard = meta.level5;
            } else if (line.startsWith("s6： ")) {
                const card = new Card(meta);
                card.level = 7;
                card.step.push(line.split("s6： ")[1]);
                cards.push(card);
                inputLocation = cards[cards.length - 1].step;
                meta.level7 = cards[cards.length - 1];
                card.parentIndex = meta.level6.index;
                card.parentCard = meta.level6;
            } else if (line.startsWith("s7： ")) {
                const card = new Card(meta);
                card.level = 8;
                card.step.push(line.split("s7： ")[1]);
                cards.push(card);
                inputLocation = cards[cards.length - 1].step;
                meta.level8 = cards[cards.length - 1];
                card.parentIndex = meta.level7.index;
                card.parentCard = meta.level7;
            } else if (line.startsWith("s8： ")) {
                const card = new Card(meta);
                card.level = 9;
                card.step.push(line.split("s8： ")[1]);
                cards.push(card);
                inputLocation = cards[cards.length - 1].step;
                meta.level9 = cards[cards.length - 1];
                card.parentIndex = meta.level8.index;
                card.parentCard = meta.level8;
            } else if (line.startsWith("答：")) {
                inputLocation = cards[cards.length - 1].detail;

                //处理文本内的图片
                // \!\[(.*\/)*([^.]+).*\]\((.*\/)*([^.]+).*\)
                let str = line.split("答：")[1];
                // str.replace(/\!\[(.*\/)*([^.]+).*\]\((.*\/)*([^.]+).*\)/,)

                inputLocation.push(str);
            } else if (line.startsWith("![")) {
                if (!inputLocation) return;
                const imgPath = line.match(/\](.+)/)[0].slice(2, -1);
                const imgName = path.basename(imgPath);
                let imgDir = [path.dirname(imgPath)]; //变为数组是为了方便运算
                if (!path.isAbsolute(imgDir[0])) {
                    imgDir.unshift(path.dirname(meta.filePath));
                }
                copyImg(imgName, imgDir.join("/"), meta.ankiPath);
                let content = `<img src="anki-paste${imgName}" >`;
                inputLocation.push(content);
            } else if (line.startsWith("注释：")) {
                inputLocation = null;
            } else {
                inputLocation && inputLocation.push(line);
            }
        });
    });

    function getNewLine(content, className = "", i) {
        //如果里面有图片，要先把图片替换成标签形式

        if (!content) return ``;
        let result;
        if (className === "counter") {
            result = `{{c${i}::${content}}}`;
        } else {
            result = content;
        }

        return `<div class="${className}">${result}</div>`;
    }

    function findParentUntilRootContainer() {
        let parentToRootFront = [];
        const findParentUntilRoot = (card) => {
            if (card.parentCard) {
                parentToRootFront.unshift(...card.parentCard.step);
                findParentUntilRoot(card.parentCard);
            }
            return parentToRootFront;
        };
        return findParentUntilRoot;
    }

    cards.forEach((card, i) => {
        //将里面的图片换成标签
        toImgCon(card);
        // let selfFront
        // if(card.modelName==='填空题-toanki'){
        //     selfFront = card.step.map((step) => getNewLine(step,'counter',i)).join("");
        // }else {
        //     selfFront = card.step.map((step) => getNewLine(step)).join("");
        // }
        const selfFront = card.step.map((step) => getNewLine(step)).join("");
        const parentUntilRootContainer = findParentUntilRootContainer();
        const parentUtilRootCardStep = parentUntilRootContainer(card);
        const parentUtilRootCardFront = parentUtilRootCardStep
            .map((step) => getNewLine(step))
            .join("");
        card.front = parentUtilRootCardFront + selfFront;

        //得到反面
        let childrenStep = [];
        const selfBack = card.detail
            .map((detail) => getNewLine(detail))
            .join("");
        //所有子卡片的step
        cards
            .filter((childCard) => {
                return childCard.parentIndex === card.index;
            })
            .forEach((childCard) => {
                childrenStep.push(...childCard.step);
            });

        const tempModelName = card.modelName;

        if (childrenStep.length === 0) {
            //如果这个卡片没有子卡片，那么他有背面，
            card.back = selfBack;
            card.modelName = tempModelName;
            // console.log(card)

            //如果没有子卡片，且自己的内容为空， 这张卡片就不存在
            if (!selfBack) {
                card.deleted = true;
            }
        } else {
            //如果这个卡片有子卡片，那么他应当是一个填空题，所有的背面放到正面，并以填空题的方式
            const childrenStepStr = childrenStep
                .map((detail, i) =>
                    getNewLine(strToImgCon(detail, card), "counter", i + 1)
                )
                .join("");
            // card.front+=selfBack
            card.front += childrenStepStr;

            card.modelName = "填空题-toanki";
            card.back = selfBack;
        }

        // card.back = selfBack + childrenStepStr;

        card.filePath = meta.filePath;
    });

    // return
    const hiddenCode = function (code) {
        return `<div style="display:none" >${code}`;
    };
    const ankiNotes = cards.map((card) => {
        return {
            ...card,
            fields: {
                正面: card.front + hiddenCode(card.index), //加入独特的字符串来允许卡片重复
                背面: card.back,
            },
            parentCard: "",
        };
    });

    const { promisify } = require("util");

    //引入数据库
    // const db = require("../db/index")("anki");

    // const dbFindOneSync = promisify(db.findOne).bind(db);
    // const dbInsertSync = promisify(db.insert).bind(db);
    // const dbUpdate = promisify(db.update).bind(db);
    // const dbRemove = promisify(db.remove).bind(db);

    //使用mongodb
    const {
        dbFindOneSync,
        dbInsertSync,
        dbUpdate,
        dbRemove,
    } = require("../api/db");

    const http = require("../http/api");

    //如果一个卡片被删除了，那么数据库里应该也删除,anki中应该也删除
    // 得到被删除的卡片
    const deletedNotes = ankiNotes.filter((note) => {
        return note.deleted === true;
    });
    //从数据库中得到note的ID，从而在anki中删除他
    // deletedNotes.forEach();
    let deleteNotesResult = 0;
    for (let i = 0; i < deletedNotes.length; i++) {
        const note = deletedNotes[i];
        const doc = await dbFindOneSync({ index: note.index });
        if (doc) {
            const result = await http.deleteNotes(doc.id);
            armDB.splice(
                armDB.findIndex((armDBNote) => {
                    return armDBNote.id === doc.id;
                }),
                1
            );
            const dbResult = await dbRemove({ id: doc.id }, {});
            deleteNotesResult += dbResult;
        }
    }
    console.log(`本地仓库db移除了${deleteNotesResult}条数据`);

    // 去除被删除的卡片,去除没有发生改变的卡片
    const notes = ankiNotes
        .filter((note) => {
            return note.deleted === false && note.deckName && note.modelName;
        })
        .filter((note) => {
            const equalNote = armDB.some((armNote) => {
                return (
                    armNote.index === note.index &&
                    armNote.front === note.front &&
                    armNote.back === note.back
                );
            });
            return !equalNote;
        });

    //如果notes长度为0，任务结束
    if (notes.length === 0) {
        console.log("卡片没有发生变动，本次更新结束====================");
        cb && cb(false);
        return;
    }
    //凡是本地没有的，就应该发往anki，同时本地也要存储,内存里也要保存
    //暂时只是标注是否需要存储
    // notes.forEach(async (note) => {

    // });
    for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        const doc = await dbFindOneSync({ index: note.index });
        if (doc) {
            if (
                note.front !== doc.front ||
                note.back !== doc.back ||
                !isArrayEqual(note.tags, doc.tags)
            ) {
                note.needUpdate = true;
                note.id = parseInt(doc.id);
            } else {
                note.needUpdate = false;
            }

            //在内存里保存引入的数据
            const docInArmDBIndex = armDB.findIndex((armNote) => {
                return armNote.index === note.index;
            });
            if (docInArmDBIndex > -1) {
                armDB.splice(docInArmDBIndex, 1, note);
            } else {
                armDB.push(note);
            }
            note.needInput = false;
        } else {
            note.needInput = true;
            note.needUpdate = false;
        }
    }
    // console.log(notes[0]);
    //需要新添加的卡片
    const needInputNotes = notes.filter((note) => note.needInput === true);
    if (needInputNotes.length > 0) {
        const { data } = await http.addNotes(needInputNotes);
        // const result = await http.addNotes(needInputNotes);
        // console.log(result)
        // const {data} = result
        // 拿到note的id
        const hasIdNotes = data.result;
        needInputNotes.forEach((note, i) => {
            note.id = parseInt(hasIdNotes[i]);
        });
        //如果有id，说明加入anki成功，所以将他们保存到数据库中
        const needInputNotesFilteById = needInputNotes
            .filter((note) => note.id)
            .map((note) => {
                return {
                    ...note,
                    parentCard: "",
                };
            });
        await dbInsertSync(needInputNotesFilteById);
        armDB.push(needInputNotesFilteById);
        console.log(
            `本次任务，添加了  ${needInputNotesFilteById.length}  个卡片`
        );
    }

    //需要更新的卡片
    const needUpdateNotes = notes.filter((note) => note.needUpdate === true);
    if (needUpdateNotes.length > 0) {
        for (let i = 0; i < needUpdateNotes.length; i++) {
            const note = needUpdateNotes[i];
            const result = await http.updateNoteFields(note);
            await dbUpdate(
                { index: note.index },
                // { $set: { fields: note.fields } }
                note
            );
        }
        // needUpdateNotes.forEach(async (note, i) => {
        console.log(`本次任务：更新了 ${needUpdateNotes.length}  个卡片`);
        // });

        // needUpdateNotes.forEach(async (note, i) => {});
        //armDB对于需要更新的卡片之前已经处理过了
    }
    // console.log(meta);
    // console.log(cards);
    cb(true);
};

function copy(value) {
    return JSON.parse(JSON.stringify(value));
}

function isArrayEqual(value1 = [], value2 = []) {
    let hash = copy(value2);
    if (value1.length === value2.length) {
        for (let i = 0; i < value1.length; i++) {
            const index = hash.indexOf(value1[i]);
            if (index > -1) {
                hash.splice(index, 1);
            } else {
                return false;
            }
        }

        return true;
    }

    return false;
}
