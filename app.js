const util = require('util');
const jsonMapper = require('./jsonMapper');
const listJsonFiles = require('./jsonList');
const fs = require('fs');

if (!process.argv[2]) {
    return console.log('Usage: node app <directory>');
}

console.log(`\n######################### Listing json files from ${process.argv[2]} #########################`);
let jsonFiles = listJsonFiles(process.argv[2]);
console.log(`We've found ${jsonFiles.length} json files`);

console.log('\n######################### Printing god object #########################');
const godJson = util.inspect(jsonMapper.mapProps(jsonFiles), { showHidden: true, depth: null });
console.log(godJson);

console.log('\n######################### Writing god object to file #########################');
fs.writeFileSync("god.txt", godJson);
console.log("Done!");