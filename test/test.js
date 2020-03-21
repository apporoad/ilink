var ilink = require('../')
var path = require('path')
var utils = require('lisa.utils')

var ss= []
ss.push(path.dirname(__dirname) + '/demo2')

console.log(JSON.stringify(ilink.getIlinkList(ss)))

// console.log(ilink.getIlinkListByCache(__dirname,{
//     scopes : ss
// }))


// console.log(ilink.getRightIlinkImplement(__dirname,'hello'))



 console.log( '命令行中是否包含 --ilinkignore 或者 --ilinkNoSearch ： ' +utils.ArrayContains(process.argv,'',(b,a)=>{
    return a && (a.toLowerCase() == '--ilinkignore' || a.toLowerCase() == "--ilinknosearch")
 }) )


