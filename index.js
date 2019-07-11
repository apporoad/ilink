var SEARCH_SCOPE= require("./enum").searchScope

var defaultOptions = {
    filter : /.*/g,
    version : "last",
    ext: {
    },
    searchScope : SEARCH_SCOPE.default
}

exports.reg = (yourModule,moduleName,options) =>{
    options = options || defaultOptions

}

exports.inject = exports.reg