const copyFile = require('./copyFile')
const path = require('path')
function copyImage(imageName, imageDir,ankiPath) {
    let src = path.join(imageDir,imageName)    
    let goal = ankiPath + "/anki-paste" + imageName;
    copyFile(src, goal,false);
}
module.exports = copyImage