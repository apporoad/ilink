var ilink = require('../')
var path = require('path')
var ss= []
ss.push(path.dirname(__dirname) + '/demo2')

// ilink.getIlinkList(ss).then(ilink=>{
//     console.log(JSON.stringify(ilink))
// })

// ilink.getIlinkListByCache(__dirname,{
//     scopes : ss
// }).then(i =>{
//     //console.log(JSON.stringify(i))
// })


ilink.getRightIlinkImplement(__dirname,'hello').then(i=>{
    console.log(i)
})