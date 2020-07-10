const Note = require('../models/Note')
const db = {
    async dbFindOneSync(params){
        return await Note.findOne(params)
    },
    async dbInsertSync(data){
       return await Note.create(data)
    },
    async dbUpdate(params,data){
        return await Note.findOneAndUpdate(params,data)
    },
    async dbRemove(params){
        const data = await Note.findOneAndDelete(params)
        if(data){
            return 1
        }else {
            return 0
        }
    }
}

module.exports = db