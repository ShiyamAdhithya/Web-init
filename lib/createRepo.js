const fs = require('fs');
const path = require('path');
const os = require('os');
const spawn = require('cross-spawn');
const ncp = require('ncp').ncp;

ncp.limit = 16;

const files = require('./files');

module.exports = {
    createPackageJson : (opt,filepath) => {

        return new Promise((resolve,reject) => {

            const root = filepath ? filepath: process.cwd();
            
            const packageJson = {
                name: opt.projectName,
                version: opt.version,
                description: opt.description,
                main: 'index.js',
                scripts: {
                    'start': 'webpack-dev-server',
                    'build': 'webpack --mode=production'
                },
                author: os.userInfo().username,
                license: 'MIT',
              };
    
              if(opt.isPrivate){
                packageJson['private'] = true;
              }


              fs.writeFile(path.join(root, 'package.json'), JSON.stringify(packageJson, null, 2) + os.EOL, (err) => {
                if (err) {
                    reject(err);
                }
                resolve();
              });
        });
        
    },

    createEsLintjson : (opt,filepath) => {
        return new Promise((resolve,reject) => {

            if(!opt.linting)
                resolve();

            const root = filepath ? filepath: process.cwd();

            let lintObj = {
                'env': {
                    'commonjs': true,
                    'es6': true,
                    'node': true,
                    'browser': true
                },
                'extends': 'eslint:recommended',
                'globals': {
                    'Atomics': 'readonly',
                    'SharedArrayBuffer': 'readonly'
                },
                'parserOptions': {
                    'ecmaVersion': 2018,
                    'sourceType': 'module'
                },
                'rules': {
                    'linebreak-style': [
                        'error',
                        'unix'
                    ],
                    'quotes': [
                        'error',
                        'double'            
                    ],
                    'semi': [
                        'error',
                        'always'
                    ],
                    'no-console': 'off'
                }
            };

            const child = spawn('npm', ['install', 'eslint', '--save-dev'],  { stdio: 'inherit', cwd: root });
                child.on('close', code => {
                if (code !== 0) {
                    reject({
                    command: `'npm' ${['install', 'eslint', '--save-dev'].join(' ')}`,
                    });
                    return;
                }
                fs.writeFile(path.join(root, '.eslintrc.json'), JSON.stringify(lintObj, null, 2) + os.EOL, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve();
                  });
            });

        });
    },

    addDevDependencies: (opt,filepath,devDepen) => {
        return new Promise((resolve,reject) => {

            const root = filepath ? path.basename(filepath): process.cwd();
            let args,command;

            command = 'npm';
            args = [
                'install',
            ];

            
            let devDependecies = ['webpack','webpack-cli','webpack-dev-server'];

            devDependecies = devDependecies.concat(devDepen);

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

            if(opt.dependencies.length === 0)
                resolve();

            const root = filepath ? path.basename(filepath): process.cwd();
            let args,command;

            command = 'npm';
            args = [
                'install',
            ];

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
            
            

            
        });
    },

    generateConfigJs : (opts,filepath) => new Promise((resolve,reject) => {
        const root = filepath ? filepath: process.cwd();
        let fileData = '';
        let exportData = {};

        /**
         * Default Requires.
         */
        const requrires = [
            {
                isPlugIn: true,
                packageName: 'html-webpack-plugin',
                variableName: 'HtmlWebpackPlugin'
            },
            {
                isPlugIn: false,
                packageName: 'path',
                variableName: 'Path'
            },
            {
                isPlugIn: true,
                packageName: 'clean-webpack-plugin',
                variableName: 'CleanWebpackPlugin'
            }
        ];

        

        let rules = [{
            test: '/\\/.html$/',
            use: [
                {
                    loader: 'html-loader?root=.!interpolate',
                    options: {
                        minimize: false,
                        attrs: ['img:src']
                    }
                }
            ]
        }];
        let devPackagesToInstall = ['html-loader'];

        if(opts.scriptStyle === 'ES6' ){
            rules.push({
                test: '/\\.js$/',
                exclude: '/(node_modules)/',
                use: {
                  loader: 'babel-loader', // transpliles es6 javascript to browser version.
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
            });

            devPackagesToInstall = devPackagesToInstall.concat(['@babel/core','@babel/preset-env', 'babel-loader']);
        }

        if(opts.assets){
            rules.push({
                test: '/\\.(png|jpg|gif|svg)$/',
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                        name: 'assets/[hash].[ext]',
                      },
                  },
                ],
            });

            devPackagesToInstall = devPackagesToInstall.concat(['file-loader']);
        }

        if(opts.Fonts){
            rules.push({
                    test: '/\\.(woff|woff2|eot|ttf|otf)$/',
                    use: [
                        {
                          loader: 'file-loader',
                          options: {
                              name: 'fonts/[name]_[hash].[ext]',
                            },
                        },
                    ]
                });

                if(!devPackagesToInstall.includes('file-loader'))  devPackagesToInstall = devPackagesToInstall.concat(['file-loader']);
        }

        if(opts.style){

            if(opts.style === 'CSS'){
                rules.push({
                             test: '/\\.css$/',
                             use: [
                                '^^templateLoader-style^^',
                                'css-loader'
                             ]
                    });
    
                    devPackagesToInstall = devPackagesToInstall.concat(['css-loader']);
            }
            else if(opts.style === 'SCSS'){
                rules.push({
                    test: '/\\.scss$/',
                    use: [
                        '^^templateLoader-style^^',
                        'css-loader', 
                        'sass-loader'
                    ]
                });
    
                devPackagesToInstall = devPackagesToInstall.concat(['css-loader','sass-loader', 'node-sass']);
            }

            requrires.push({
                isPlugIn: true,
                packageName: 'mini-css-extract-plugin',
                variableName: 'MiniCssExtractPlugin',
                templates: { 
                    style: 'MiniCssExtractPlugin.loader'
                }
            });
        }

        let pluginsReplaceData = 
            `new HtmlWebpackPlugin({
                template: Path.resolve(__dirname, 'src/index.html'),
                filename: "./index.html"
            }),
            new MiniCssExtractPlugin({
                filename: "[name].css",
                chunkFilename: "[id].css"
            }),
            new CleanWebpackPlugin()`;


        devPackagesToInstall = devPackagesToInstall.concat(requrires.filter(item => item.isPlugIn === true).map(item => item.packageName));
        

        exportData['entry'] = {
            main: './src/js/index.js'
        };

        exportData['output'] = {
            filename: '[name].[hash].js',
            path: '__dirname + /dist'
        };

        exportData['module'] = {
            rules
        };

        exportData['plugins'] = ['^^ReplacePlugin^^'];


        fileData = requrires.map(item => {
            return `const ${item.variableName} = require('${item.packageName}');`;
        }).join('\n');
        fileData += '\n \n';
        fileData += 'module.exports = ' + JSON.stringify(exportData, null, 2) + os.EOL;

        fileData = fileData.replace(/"__dirname \+ /,'__dirname + "');
        // eslint-disable-next-line no-useless-escape
        fileData = fileData.replace(/\"\^\^ReplacePlugin\^\^\"/,pluginsReplaceData);

        let templateLoader = requrires.filter(item => item.templates);

        if(templateLoader){
            for(let item of templateLoader){
                // eslint-disable-next-line no-useless-escape
                fileData = fileData.replace(/"\^\^templateLoader-style\^\^"/g,item.templates.style);
            }
        }

        // eslint-disable-next-line no-useless-escape
        fileData = fileData.replace(/\"\/.*\/\"/g,(match) => {
            return match.replace(/"/g,'').replace(/\\/,'');
        });
        
        
        

        fs.writeFile(path.join(root, 'webpack.config.js'), fileData, (err) => {
            if (err) {
                reject(err);
            }
            //console.log(devPackagesToInstall);
            resolve(devPackagesToInstall);
          });

    }),

    createTemplateProject: (filepath) => new Promise((resolve,reject) => {

        const root = filepath ? path.basename(filepath): process.cwd();
        files.createDirectory(root,'src');

        const srcPath = path.join(root,'src');

        ncp(path.resolve(__dirname + '/templates'), srcPath, err => {
            if (err) {
              reject(err);
            }
            resolve();
        });

    })

};


