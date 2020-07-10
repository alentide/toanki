const mongoose = require("mongoose");
const schema = new mongoose.Schema({
    step:Array,
    detail:Array,
    index: String,
    deckName: String,
    modelName:String,
    tags:Array,
    filePath:Array,
    deleted: Boolean,
    level: Number,
    parentIndex:String,
    parentCard:String,
    front:String,
    back:String,
    fields: {
        '正面': String,
        '背面': String,
    },
    needInput: Boolean,
    needUpdate: Boolean,
    id: Number,

});
module.exports = mongoose.model("Note", schema);
