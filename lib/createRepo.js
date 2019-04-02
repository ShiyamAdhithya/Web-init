module.exports = {
    createPackageJson : (opt) => {

        return new Promise((resolve,reject) => {

            const fs = require('fs');
            const path = require('path');
            const os = require('os');

            const root = path.resolve(process.cwd());
            
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
              
              fs.writeFile(path.join(root, 'packages.json'), JSON.stringify(packageJson, null, 2) + os.EOL, (err) => {
                if (err) {
                    reject(err);
                };
                resolve();
              });
        });
        
    }
};


