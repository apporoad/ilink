var SEARCH_SCOPE= require("./enum").searchScope
const dproxy = require("dproxy.js")
const util = require("./util")
const debug = require('debug')('ilink')

var defaultOptions = {
    filter : /.*/g,
    version : "last",
    ext: {
    },
    searchScope : SEARCH_SCOPE.default,
    scopes : [],
    verbose : false
}

exports.SEARCH_SCOPE = SEARCH_SCOPE

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


exports.getRightIlinkImplement = (unimplementFilePath,moduleName,options)=>{



}

exports.getSearchScope =(unimplementFilePath,options)=>{
    var searchScope = options.searchScope  ||  SEARCH_SCOPE.default
    if(searchScope == SEARCH_SCOPE.custom)
    {
        if(options.scopes && options.scopes.length > 0)
            return options.scopes
        return []
    }
    //todo global and all
    var scopes = []
    //env
    if(process.env.ILINK_SCOPES){
        var env_scopes = ILINK_SCOPES.split(",|，|\\||:")
        env_scopes.forEach(es => {
            if(es && util.trim(es)){
                
                debug("add env ilink scope :" , util.trim(es))
            }
        });
    }
    //params
    if(options.scopes && options.scopes.length>0){
        options.scopes.forEach(es =>{
            if(es && util.trim(es)){
                scopes.push(util.trim(es))
            }
        })
    }
    //default
    var topPath = util.getTopScanPath(unimplementFilePath)
    if(topPath)
        scopes.push(topPath)
}