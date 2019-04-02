const fs = require('fs');
const path = require('path');
const os = require('os');
const spawn = require('cross-spawn');




module.exports = {
    createPackageJson : (opt,filepath) => {

        return new Promise((resolve,reject) => {

            const root = filepath ? filepath: process.cwd();
            
            const packageJson = {
                name: opt.projectName,
                version: opt.version,
                description: opt.description,
                scripts: {
                    "start": "webpack-dev-server",
                    "build": "webpack --mode=production"
                },
                author: os.userInfo().username,
                license: "MIT",
              };
    
              if(opt.isPrivate){
                packageJson['private'] = true;
              }


              fs.writeFile(path.join(root, 'package.json'), JSON.stringify(packageJson, null, 2) + os.EOL, (err) => {
                if (err) {
                    reject(err);
                };
                resolve();
              });
        });
        
    },

    addDevDependencies: (opt,filepath) => {
        return new Promise((resolve,reject) => {

            const root = filepath ? path.basename(filepath): process.cwd();
            let args,command;

            command = 'npm';
            args = [
                'install',
            ];

            
            let devDependecies = ['webpack','webpack-cli','webpack-dev-server','html-webpack-plugin'];

            if(opt.scriptStyle === 'ES6'){
                devDependecies = devDependecies.concat(['@babel/core','@babel/preset-env','babel-loader']);
            }

            if(opt.style === 'SCSS'){
                devDependecies = devDependecies.concat(['css-loader','sass-loader','style-loader','node-sass','mini-css-extract-plugin']);
            }

            if(opt.assets){
                devDependecies = devDependecies.concat(['file-loader']);
            }

            args = args.concat(devDependecies,'--save-dev');

            args = args.concat(['--loglevel','error']);



            const child = spawn(command, args, { stdio: 'inherit', cwd: root });
            child.on('close', code => {
            if (code !== 0) {
                reject({
                command: `${command} ${args.join(' ')}`,
                });
                return;
            }
            resolve();
            });
        });
    },

    addDependencies: (opt,filepath) => {
        return new Promise((resolve,reject) => {

            const root = filepath ? path.basename(filepath): process.cwd();
            let args,command;

            command = 'npm';
            args = [
                'install',
            ];

            if(opt.dependencies.length > 0){
                args = args.concat(opt.dependencies);

                args = args.concat(['--loglevel','error']);

                

                const child = spawn(command, args, { stdio: 'inherit', cwd: root });
                child.on('close', code => {
                if (code !== 0) {
                    reject({
                    command: `${command} ${args.join(' ')}`,
                    });
                    return;
                }
                resolve();
                });
            }
            

            
        });
    },


};


