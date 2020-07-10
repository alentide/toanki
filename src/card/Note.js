const str = `![image-20200414005331099](md/temp.assets/image-20200414005331099.png)`
const path = require('path')
const imgDir = [path.resolve(str.match(/\](.+)/)[0].slice(2,-1))]
console.log(imgDir)