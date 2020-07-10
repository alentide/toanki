module.exports = function(str){
    if(str.startsWith('用户：')){
        return {
            key: 'user',
            content: str.split('用户：')[1]
        }
    }else {
        return str
    }
}