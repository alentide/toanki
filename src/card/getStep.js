module.exports = function(str){
    let trimedStr = str.trim()

    let trimedStrArr = trimedStr.split(' ')
    let level

    switch(trimedStrArr[0]){
        case '##':
            level = 2;
            break;
        case '###':
            level = 3;
            break;
        case '####':
            level = 4;
            break;
        case '#####':
            level = 5;
            break;
        case '######':
            level = 6;
            break;
        default:
            level = 0;
            break;
    }

    if(level){
        return {
            level,
            key: 'step',
            content: trimedStrArr.slice(1).join(' ')
        }
    }else {
        return str
    }
}