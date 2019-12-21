var SEARCH_SCOPE= require("./enum").searchScope
const dproxy = require("dproxy.js")
const util = require("./util")
const debug = require('debug')('ilink')
const path = require('path')
const find = require('find')
const fs = require('fs')
const lisaUtils = require('lisa.utils')
const os = require('os')
const hash= require('hash-sum')

//todo
const defaultValidPeriod = 60000

var defaultOptions = {
    filter : /.*/g,
    version : "lastest",
    ext: {
    },
    searchScope : SEARCH_SCOPE.default,
    scopes : [],
    verbose : false,
    validPeriod : 60000
}

exports.SEARCH_SCOPE = SEARCH_SCOPE

exports.reg = (yourModule,moduleName,options) =>{
    options = options || defaultOptions

    if(!yourModule){
        throw Error("ilink:reg: your must input a module")
    }
    debug('your reg moduleName:' + (moduleName||'nil'))
    //yourModule.filename
    //"e:\workspace\ilink\demo1\unimplement.js"
    
    var ilink = exports.getRightIlinkImplement(yourModule.filename,moduleName,options)
    if(ilink){
        debug('your ilink is ' + ilink)
        try
        {
            var js = require(ilink.mainPath)
            Object.defineProperty(yourModule, 'loaded', {
                get: function() {
                    return loaded;
                },
                set: function(value) {
                    //console.log(yourModule.exports)
                    if(value){
                        //console.log(yourModule.id + ' loaded: ' + value);
                        //here load complete //and set proxy
                        dproxy.setProxy(yourModule.exports,js)
                    }
                }
            })
        }catch(e){
            console.log('ilink load module failed:' + ilink.src + ' [err]:' + e)
        }
    }
    else{
        console.log('ilink cant find your implement:'+moduleName)
    }
    
}

exports.inject = exports.reg


exports.getRightIlinkImplement = (unimplementFilePath,moduleName,options)=>{
    var tags = exports.getIlinkTags(unimplementFilePath,moduleName)
    var ilink =exports.getIlinkListByCache(unimplementFilePath,options) 
    var mn = moduleName || 'default'
    if(ilink.ilinks[mn]){
        var mnLinks = ilink.ilinks[mn]
        if(tags && tags.length>0){
            var rlinks = []
            for(var i=0 ;i<tags.length;i++){
                for(var j =0 ;j<mnLinks.length ;j++){
                    if(mnLinks[j].tags && lisaUtils.ArrayContains(mnLinks[j].tags,tags[i])){
                        rlinks.push(mnLinks[j])
                    }
                }
            }
            //console.log(rlinks)
            if(rlinks.length == 0) {
                throw Error('ilink taged : ' + tags + ' implemented cannot be found!')
            }
            rlinks.sort((a,b)=>{
                return a.version < b.version
            })
            return rlinks[0]
        }
        else{
            ilink.ilinks[mn].sort((a,b)=>{
                return a.version < b.version
            })
            return ilink.ilinks[mn][0]
        }
    }
    else{
        return 
    }
}

var getIlinkTempDir = (unimplementFilePath)=>{
    if(!process.env.ILINK_CACHE_PATH)
    {
        if(!fs.existsSync(os.tmpdir() + '/ilink')){
            fs.mkdirSync(os.tmpdir() + '/ilink')
        }
    }
    var ilinkTempDir = path.join(process.env.ILINK_CACHE_PATH || os.tmpdir() + '/ilink', hash(unimplementFilePath))
    if(!fs.existsSync(ilinkTempDir)){
        fs.mkdirSync(ilinkTempDir)
    }
    console.log(ilinkTempDir)
    return ilinkTempDir
}

exports.getIlinkTags =(unimplementFilePath,moduleName)=>{
    var ilinkConfigPath = path.join( getIlinkTempDir(unimplementFilePath),'ilink.config.json')
    var ilinkConfig = null
    if(fs.existsSync(ilinkConfigPath)){
        ilinkConfig = require(ilinkConfigPath)
    }
    if(process.env.ILINK_TAGS){
        //moduleName:tag1,tag2;moduleName2:tag3,tag4
        ilinkConfig = ilinkConfig || {}
        ilinkConfig.updateTime = Date.now()
        ilinkConfig.selectTags = ilinkConfig.selectTags || {}
        var isModified = false
        process.env.ILINK_TAGS.split(';').forEach(moduleAndTag=>{
            var ATArray = moduleAndTag.split(':')
            if(ATArray.length==1){
                // moduleName:   or  moduleName
                if(ilinkConfig.selectTags[ATArray[0]]){
                    ilinkConfig.selectTags[ATArray[0]] = null
                    isModified =true
                }
            }else{
                // moduleName: tag1  or  moduleName:tag1,tag2
                var ts = ATArray[1].split(',')
                var rts = []
                ts.forEach(t=>{ rts.push(t)})
                
                if(ilinkConfig.selectTags[ATArray[0]] && lisaUtils.ArrayEquals(ilinkConfig.selectTags[ATArray[0]],
                    rts)){
                        //do nothing
                }
                else{
                    ilinkConfig.selectTags[ATArray[0]] = rts
                    isModified = true
                }
                //ilinkConfig.selectTags[ATArray[0]]
            }
        })
        if(isModified){
            // write to file
            fs.writeFileSync(ilinkConfigPath,JSON.stringify(ilinkConfig))
        }
    }
    if(ilinkConfig && ilinkConfig.selectTags 
        && ilinkConfig.selectTags[moduleName]
        && ilinkConfig.selectTags[moduleName].length>0){
        return ilinkConfig.selectTags[moduleName]
    }else{
        return null
    }
}
exports.getIlinkListByCache=(unimplementFilePath,options)=>{
    options = options || {}

    // 1. get scops  get scopes only needed
    var scopes = null //exports.getSearchScope(unimplementFilePath,options)
    // 2. get ilink.cache.json
    var cachePath = path.join(getIlinkTempDir(unimplementFilePath),'ilink.cache.json')
    debug('ilink cache path:', cachePath)
    var ilink =null
    if(fs.existsSync(cachePath)){
        ilink = require(cachePath)
    }
    if(ilink){
        var vp = options.validPeriod || defaultValidPeriod
        // 3. check ValidPeriod
        if(ilink.cacheTime && (Date.now() - ilink.cacheTime < vp )){
            scopes = exports.getSearchScope(unimplementFilePath,options)
            // check scopes
            if(!lisaUtils.ArrayEquals(scopes,ilink.scopes)){
                console.log('ilink: scopes updates,plz keep scopes stable!')
                fs.unlinkSync(cachePath)
                ilink =null
            }
        }else{
            //remove cache
            ilink = null
            fs.unlinkSync(cachePath)
        }
    }
    if(!ilink){
        if(!scopes)
            scopes = exports.getSearchScope(unimplementFilePath,options)
        ilink = exports.getIlinkList(scopes)
        fs.writeFileSync(cachePath,JSON.stringify(ilink))

    }
    return ilink
}


exports.getIlinkList=(scopes) =>{
    var files=[]
    scopes.forEach(s=>{
        files.push(find.fileSync(/\.ilink\.js$/, s))
        files.push(find.fileSync('ilink.json',s))
    })
    /*
    [ 'F:\\workspace\\ilink\\demo2\\ilink_modules\\hello.ilink.js',
    'F:\\workspace\\ilink\\demo2\\ilink_modules\\world.ilink.js',
    'F:\\workspace\\ilink\\demo2\\test\\abc.ilink.js' ]
    [ 'F:\\workspace\\ilink\\demo2\\ilink.json',
    'F:\\workspace\\ilink\\demo2\\test\\ilink.json' ]
    */
    var ilinkObject = {
    cacheTime : Date.now(),
    scopes : scopes,
    ilinks:{}
    }
    files.forEach(fs1=>{
        fs1.forEach(f=>{
            var bn = path.basename(f)
            if(bn==='ilink.json'){
            /*{
                "name":"your moduleName",
                "moduleName":"your moduleName , prior to name",
                "main":"index.js(your enter js)",
                "version":"1.0.1(yourVersion)"
            }*/
                var i = require(f)
                var mn = i.moduleName || i.name || 'default'
                if(!ilinkObject.ilinks[mn]){
                    ilinkObject.ilinks[mn] =[]
                }
                var tags = null
                if(i.tag){
                    tags= [i.tag]
                }
                if(i.tags){
                    tags = (tags || []).concat(i.tags)
                }
                ilinkObject.ilinks[mn].push({
                    mainPath : path.resolve(path.dirname(f),(i.main|| 'index.js')),
                    version : i.version || "1.0.0",
                    src : f,
                    tags : tags
                    })
            }else{
                var mn = bn.substr(0,bn.length-9)
                if(!ilinkObject.ilinks[mn]){
                    ilinkObject.ilinks[mn] =[]
                }
                ilinkObject.ilinks[mn].push({
                    mainPath : f,
                    version : "1.0.0",
                    src : f,
                    tags : null
                    })
            }
        })
    })
    return ilinkObject
}

exports.getSearchScope =(unimplementFilePath,options)=>{
    options = options || defaultOptions
    var searchScope = options.searchScope  ||  SEARCH_SCOPE.default
    if(searchScope == SEARCH_SCOPE.custom)
    {
        if(options.scopes && options.scopes.length > 0)
            return options.scopes
        return []
    }
    else if(searchScope === SEARCH_SCOPE.all || searchScope=== SEARCH_SCOPE.global){
        //todo global and all
        console.log('your searchScope:' + searchScope + '  will be implemented in the future')
    }
    var scopes = []
    //env
    if(process.env.ILINK_SCOPES){
        var env_scopes = process.env.ILINK_SCOPES.split(/,|，|:/)
        env_scopes.forEach(es => {
            if(es && util.trim(es)){
                debug("add env ilink scope :" ,es)
                scopes.push(util.trim(es))
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
    var currentDir = path.dirname(unimplementFilePath)

    // resole path
    var rs= []
    scopes.forEach(ele=>{
        rs.push(path.resolve(currentDir,ele))
    })
    return rs
}