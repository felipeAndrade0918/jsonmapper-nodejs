const fs = require('fs');
const path = require('path');

function listJsonFiles(dir) {
    let jsonFiles = [];

    fs.readdirSync(dir).forEach(file => {
        const fileFullPath = path.join(dir, file);

        if (fs.statSync(fileFullPath).isDirectory()) {
            recursiveJsonFiles = listJsonFiles(fileFullPath);

            if (recursiveJsonFiles.length > 0) {
                jsonFiles = [...jsonFiles, ...recursiveJsonFiles];
            }
        } else if (path.extname(fileFullPath) == '.json') {
            jsonFiles.push(JSON.parse(fs.readFileSync(fileFullPath, 'utf8')));
        }
    });

    return jsonFiles;
}

module.exports = listJsonFiles;