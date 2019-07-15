const path = require('path')
const fs = require('fs')


exports.trim= (x) =>{
    return x.replace(/^\s+|\s+$/gm,'');
}


var iJudgeDir = dir=>{
    var packageJson = path.join(dir,"package.json")
    var node_modules = path.join(dir, "node_modules")
    if(fs.existsSync(packageJson) || fs.existsSync(node_modules)){
        return true
    }
    return false
}
//recurse find a dir with node_modules or package.json as topScanPath
var igetTopScanPath = dir=>{
    var dirs = new Array()

    var currentDir = dir
    while(true){
        if(iJudgeDir(currentDir)){
            dirs.push(currentDir)
        }
        if(currentDir == path.dirname(currentDir)){
            break
        }
        currentDir = path.dirname(currentDir)
        //console.log(currentDir)
    }
    //console.log(dirs.pop())
    return dirs.length >0 ? dirs.pop() : null
}


exports.getTopScanPath = igetTopScanPath


/**
 * 字符串并集 从右边开始交
 */
exports.stringRightIntersection = (str1,str2) => {
    var result = ''
    for(var i = 0 ; i<str1.length ; i++){
        if(i + 1  > str2.length){
            return result
        }
        //console.log(`str1[${str1.length - i-1}] :` + str1.substr(str1.length - i-1,1))
        //console.log(`str2[${str2.length - i-1}] :` + str2.substr(str2.length - i-1,1))
        if(str1.substr(str1.length - i-1,1) ===  str2.substr(str2.length - i-1,1)){
            result = str1.substr(str1.length - i-1,1) + result
        }else{
            return result
        }
    }
    return result
}


/**
 * 字符串并集 从左边开始交
 */
exports.isStringLeftContains = (str1,str2) => {
    //todo
}

/**
 * 数组并集
 */
exports.arrayIntersectionCount = (array1,array2,equalsFn) => {
    equalsFn = equalsFn || ((ele1,ele2)=> {return ele1 === ele2})
    if(!array1 || !array2) return 0
    var count = 0
    for(var i=0;i<array1.length;i++){
        for(var j=0;j<array2.length;j++){
            if(equalsFn(array1[i],array2[j])){
                count++
                break
            }
        }
    }
    return count
}