## upload-to-oss-plugin
webpack的插件，用于自动上传静态资源到阿里的oss上，以便作为静态资源使用，当然你也可以用于自动存储大文件。  

Installation
-------------
Install the plugin with npm:
```shell
$ npm install upload-to-oss-plugin --save-dev
```

Basic Usage
-----------

add the plugin to your webpack config as follows:

```javascript
var UploadToOssPlugin = require('upload-to-oss-plugin')
var webpackConfig = {
  entry: 'index.js',
  output: {
    path: 'dist',
    filename: 'index_bundle.js'
  },
  plugins: [new UploadToOssPlugin({
    buildPath:'your build path',
    region: 'your region',
    accessKeyId: 'your key',
    accessKeySecret: 'your secret',
    bucket: 'your bucket',
    generateObjectPath: function(filename) {
      return filename
    }
  })]
}
```   
Configuration
-------------
The plugin allowed values are as follows:
- `buildPath`: 需要上传的文件路径,支持整个文件夹的遍历。支持node-glob风格路径，具体可以参见[node-glob的文档](https://github.com/isaacs/node-glob)。
- `region`: oss的区域，如:oss-cn-shanghai。
- `accessKeyId`: 阿里云的权限访问的key。
- `accessKeySecret`: 阿里云的权限访问的secret。
- `bucket`: 阿里云OSS上的命名空间。
- `generateObjectPath`: 函数（可选），函数参数为上传的文件名，必须返回一个字符串作为文件名，默认为文件原名。通过该函数可以让使用者自定义上传的文件名或者修改oss的路径，比如加一个前缀等

