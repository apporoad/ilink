
var defaultOptions = {
    filter : /.*/g,
    version : "last",
    ext: {
    }
}

exports.reg = (yourModule,moduleName,options) =>{
    options = options || defaultOptions

}

exports.inject = exports.reg