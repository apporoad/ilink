<div align=center><img src="https://raw.githubusercontent.com/apporoad/ilink/master/docs/ilink_logo.png"/></div>  

# ilink

爱令可  a program due to pplugins , ilink short for invoke link,  meaning to solve invoke link



[![avatar](https://raw.githubusercontent.com/apporoad/designs/master/ilink_design.png "link to jpg")](https://raw.githubusercontent.com/apporoad/designs/master/ilink_design.png)  


## phil(哲学)

[phil](./phil.md)

## how to use
```bash
npm i --save ilink.js

# add an unimplement js 
vim unimplement.js
```
```js
var options = {}
require("ilink.js").reg(module,"yourModuleName",options)
exports.hello=function(){}
exports.good = "good"
```
```bash
# then  add your invoke
vim test.js
```
```js
var yourModule = require('./unimplement.js')
yourModule.hello()
console.log(yourModule.good)
```
```bash
# just try it
node test.js

# then add implement for unimplement 
vim [yourModuleName].ilink.js
```
```js
exports.hello=function(){ console.log("hello hello good day")}
exports.good = "better"
```
```bash
# try again
node test.js

# you can also assign a main js  with an ilink.json  just like package.json
```
```json
{
    "name":"your moduleName",
    "moduleName":"your moduleName , prior to name",
    "main":"index.js(your enter js)",
    "version":"1.0.1(yourVersion)",
    "tag":"your tag , invoke use this to select implement",
    "tags": [ "tag1","tag2 juset like tag"]
}
```

## recommended use

[demo](https://github.com/apporoad/ilink.demo)

## options
```js
{
    searchScope : 1,
    scopes : [],
    verbose : false,
    validPeriod : 60000 * 60,
    timeout : 2000
}

```
1. searchScope ： 查询实现的模式 默认为1  ， 自定义采用4
默认的搜索逻辑为： 加载环境变量ILINK_SCOPES 定义的目录,多目录时可以以 , 或者:隔开  
同时加载未实现文件所在项目的所有子目录，故如果外部项目需要全局安装的话，搜索效率会非常低
2. scopes ： ilink实现所在的路径，数组表示多个， 只有当searchScope为4时有效  
非常重要，如果外部用户不希望采用ilink默认的搜索方式，请采用这种方式集成
3. verbose ： 是否展示详细提示信息
4. validPeriod : ilink验证间隔，默认1小时，根据实际项目状况选择，该时间决定ilink的缓存时间，这段时间内不会重复扫描ilink实现
5. timeout : 搜索scope的时间，如果超过，自动停止搜索

### 
how to debug
```bash
npm i debug
set DEBUG=*,-not_this
```

env_scopes
```bash
# 设置 ilink 搜索 scopes， 默认还包含 unimplement.js所在node项目中
export ILINK_SCOPES=/s1,/s2

# 设置 ilink cache path  默认存放在/tmp/ilink/ (windows有所区别)
export ILINK_CACHE_PATH=/cache

# 设置 ilink 选择tag ,指定调用的模块优先选择对应的实现
export ILINK_TAGS="moduleName:tag1,tag2;moduleName2:tag3,tag4"
```


more demo @ ilinkDemos.zip , you shall unzip it

## tips
if you use tags， you shall set ILINK_CACHE_PATH , /tmp is not safe    
如果需要使用tag指定实现，那么强烈建议设置ILINK_CACHE_PATH， 因为系统临时文件夹是不可靠的，这个在生产环境尤为重要   

如果不采用ilink，采用默认实现，启动参数请加上 --ilinkignore