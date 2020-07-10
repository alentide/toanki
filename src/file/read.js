module.exports = (filename)=>{
    const fs = require('fs')
    const exist = fs.existsSync(filename)
    
    if(!exist){
        return ['']
    }
    const fileContentByLine = fs.readFileSync(filename,'utf-8').split('\r\n\r\n')
    return fileContentByLine.map(line=>{
        return line.trim()
    })
}