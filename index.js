var SEARCH_SCOPE= require("./enum").searchScope
const dproxy = require("dproxy.js")

var defaultOptions = {
    filter : /.*/g,
    version : "last",
    ext: {
    },
    searchScope : SEARCH_SCOPE.default,
    scopes : [],
    verbose : false
}

exports.reg = (yourModule,moduleName,options) =>{
    options = options || defaultOptions

    if(!yourModule){
        throw Error("ilink:reg: your must input a module")
    }
    //yourModule.filename
    //"e:\workspace\ilink\demo1\unimplement.js"
    
    Object.defineProperty(yourModule, 'loaded', {
        get: function() {
            return loaded;
        },
        set: function(value) {
            //console.log(yourModule.exports)
            if(value){
                //console.log(yourModule.id + ' loaded: ' + value);
                //here load complete //and set proxy
                dproxy.setProxy(yourModule.exports,require("./demo1/ilink_modules/implement.ilink.js"))
            }
        }
    })
}

exports.inject = exports.reg


exports.getRightIlinkImplement = (unimplementFilePath,options)=>{



}

exports.getSearchScope =()=>{}