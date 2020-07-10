module.exports = function(str){
    
    if(str.startsWith('标签：')){
        const tagStr = str.split('标签：')[1].trim()
        const tagArr = tagStr.split(' ')
        let result  =  {
            key: 'tag',
            content: tagStr.substring(1)
        }
        return tagArr.map(tag=>{
            if(tag.startsWith('-')){
                return {
                    key: 'tag',
                    operate:'delete',
                    content: tag.substring(1)
                }
                
            }else if(tag.startsWith('+')){
                return {
                    key: 'tag',
                    operate:'add',
                    content: tag.substring(1)
                }
            }else {
                return {
                    key: 'tag',
                    operate:'replace',
                    content: tag
                }
            }
        })
    }else {
        return str
    }
}