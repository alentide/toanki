module.exports = app =>{
    const mongoose = require('mongoose')
    const db = mongoose.connection
    db.once('open',()=>{
        console.log('mongodb connect successly')
    })
    db.on('error',err=>{
        console.log(err)
    })
    mongoose.connect('mongodb://127.0.0.1:27017/toanki',{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
}

