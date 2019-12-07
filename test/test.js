var ilink = require('../')
var path = require('path')
var ss= []
ss.push(path.dirname(__dirname) + '/demo2')

//console.log(JSON.stringify(ilink.getIlinkList(ss)))

// console.log(ilink.getIlinkListByCache(__dirname,{
//     scopes : ss
// }))


console.log(ilink.getRightIlinkImplement(__dirname,'hello'))