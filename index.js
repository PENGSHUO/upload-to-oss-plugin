const oss = require('ali-oss');
const ora = require('ora');
const chalk = require('chalk');
const glob = require("glob");

function UploadToOssPlugin(options){
    if (!options || !options.buildPath || !options.region || !options.accessKeyId || !options.accessKeySecret || !options.bucket ) {
		console.log(chalk.cyan('Some parameters of the problem，please set as the follow:'))
		console.log(chalk.cyan(" new".red + " AliyunossWebpackPlugin({"));
		console.log(chalk.cyan("   buildPath:'your path',"));
		console.log(chalk.cyan("   region: 'your region',"));
		console.log(chalk.cyan("   accessKeyId: 'your accessKeyId',"));
		console.log(chalk.cyan("   accessKeySecret: 'your accessKeySecret',"));
		console.log(chalk.cyan("   bucket: 'your bucket'"));
        console.log(chalk.cyan("   ossRootDir: 'your ossRootDir'"));
		console.log(chalk.cyan(" })"));
		throw new Error('Some parameters of the problem')
	}
	this.fileArray = [];
	this.options = options;
    this.generateObjectPath = this.options.generateObjectPath || function(filePath){
        return filePath
    }
    this.store = oss({
        region: this.options.region,
        accessKeyId:this.options.accessKeyId,
        accessKeySecret:this.options.accessKeySecret,
        bucket:this.options.bucket
    })
}

UploadToOssPlugin.prototype.apply = function(compiler){
    compiler.hooks.done.tapAsync('UploadToOssPlugin',async (stats,cb)=>{
        const ossSpinner = ora('\nuploading file to oss...');
        ossSpinner.start();
        await this.readDir()
        ossSpinner.stop();
        console.log(chalk.cyan(" all files upload success"))
        cb()
    })
}

UploadToOssPlugin.prototype.readDir = function(){
    return new Promise(async (resolve)=>{
        glob.sync(this.options.buildPath,{nodir:true}).map(async (originFilePath)=>{
            let ossfilePath = this.generateObjectPath(originFilePath)
            await this.uploadFile(ossfilePath,originFilePath)
        });
        resolve();
    })
}

UploadToOssPlugin.prototype.uploadFile = function(ossfilePath,originFilePath){
    return new Promise(async (resolve,reject)=>{
        if(!this.store){
            reject('oss instance not exist');
        }
        const respones = await this.store.put(ossfilePath, originFilePath);
        if (respones.res.status != 200){
            reject('file upload fail')
        }
        resolve();
    })
}

module.exports = UploadToOssPlugin;