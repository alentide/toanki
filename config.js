const path = require("path");
const fs = require("fs");
const USER_HOME = process.env.HOME || process.env.USERPROFILE;
// const notesPath = path.resolve(USER_HOME, "DailyNotes");
// \AppData\Roaming\Anki2\alentide\collection.media
const user = 'alentide'
// const ankiStorePath = path.resolve(USER_HOME,`/AppData/Roaming/Anki2/${user}/collection.media`)
const filePath = path.resolve(USER_HOME,`./AppData/Roaming/Anki2/`)
module.exports = {
    filePath: filePath,
    user,
}


const a =[
    0,
    1,
    2,
    3
]

console.log(a.map(m=>{
    if(m>2){
        return
    }
    return m*3
}))