const convert = require('./convert')
const json = require('./json')
const AdmZip = require('adm-zip');
const fs = require('fs')
const shell = require('shelljs')
const goGitIt = require('go-git-it')
const path = require('path')

function dir(target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target);
    }
}
function copyFolderSync(source, target) {
  // Create target folder if it doesn't exist
  dir(target);

  // Get all files and subfolders in source folder
  fs.readdirSync(source).forEach(function (file) {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);

    // If current item is a file, copy it
    if (fs.statSync(sourcePath).isFile()) {
      fs.copyFileSync(sourcePath, targetPath);
    }

    // If current item is a folder, recursively call this function
    if (fs.statSync(sourcePath).isDirectory()) {
      copyFolderSync(sourcePath, targetPath);
    }
  });
}
dir('./run/')
dir('./run/build/')
dir('./run/svg/')
copyFolderSync('./resource/', './run/resource/')

// Clone GitHub Repo
// /assets/svg/
// goGitIt('https://github.com/twitter/twemoji/tree/master/assets/svg', './run/')

var unicodes = convert.mc("./run/svg/", "./run/resource/assets/minecraft/textures/font/")
console.log(unicodes)
fs.writeFile('./run/resource/assets/minecraft/font/default.json', json.generateJson(unicodes), (err) => {
    if (err) throw err;
    console.log('Font File Success');
    
// package
const zip = new AdmZip();
zip.addLocalFolder("./run/resource");

const buffer = zip.toBuffer();
fs.writeFileSync("./run/build/AndrosDiscordEmojis.zip", buffer);

    console.log('Done');
});

