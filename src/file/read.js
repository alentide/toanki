module.exports = (filename)=>{
    const fs = require('fs')
    const os = require('os')
    const exist = fs.existsSync(filename)
    
    if(!exist){
        return ['']
    }
    // const fileContentByLine = fs.readFileSync(filename,'utf-8').split('\r\n\r\n')
    const fileContentByLine = fs.readFileSync(filename,'utf-8').split(os.EOL)
    return fileContentByLine.map(line=>{
        return line.trim()
    })
}