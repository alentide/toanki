const getDetail = function(str){
    let trimedStr = str.trim()
    if(trimedStr.startsWith('答：')){
        return {
            key: 'detail',
            content: trimedStr.substring(2).trim()
        }
    }else {
        return str
    }
}

module.exports = getDetail