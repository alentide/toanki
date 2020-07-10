const NeDB = require('nedb')

const db = function(dbName){
    return new NeDB({
        filename: __dirname +'/../../dbs/'+dbName+'.db',
        autoload: true
    })
}

module.exports = db