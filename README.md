<div align=center><img src="https://raw.githubusercontent.com/apporoad/ilink/master/docs/ilink_logo.png"/></div>  

# ilink

爱令可  a program due to pplugins , ilink short for invoke link,  meaning to solve invoke link



[![avatar](https://raw.githubusercontent.com/apporoad/ilink/master/docs/ilink_design.png "link to jpg")](https://raw.githubusercontent.com/apporoad/ilink/master/docs/ilink_design.png)  



## how to use
```bash
npm i --save ilink.js

# add an unimplement js 
vim unimplement.js
```
```js
require("ilink.js").reg(module,"yourModuleName")
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
    "version":"1.0.1(yourVersion)"
}
```




### 
how to debug
```bash
set DEBUG=*,-not_this
```

env_scopes
```bash
# 设置 ilink 搜索 scopes
export ILINK_SCOPES=/s1,/s2

# 设置 ilink cache path
export ILINK_CACHE_PATH=/cache

```


more demo @ ilinkDemos.zip , you shall unzip it