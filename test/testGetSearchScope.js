
//set ILINK_SCOPES=/s1,/s2

var ilink = require('../index')

var defaultOptions = {
    filter : /.*/g,
    version : "last",
    ext: {
    },
    searchScope : 1,
    scopes : ['/hello','world/'],
    verbose : false
}

var scopes = ilink.getSearchScope( __dirname +'/testUtil.js',defaultOptions)

scopes.forEach(element => {
    console.log(element)
});