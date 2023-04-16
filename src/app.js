const convert = require('./convert')
const json = require('./json')
const AdmZip = require('adm-zip');
const fs = require('fs')
const shell = require('shelljs')
const goGitIt = require('go-git-it')
const path = require('path')

const workFolder = './run/'

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
dir(workFolder)
dir(workFolder + 'build/')
dir(workFolder + 'svg/')
copyFolderSync('./resource/', workFolder + 'resource/')

// Clone GitHub Repo
// /assets/svg/
goGitIt('https://github.com/twitter/twemoji/tree/master/assets/svg', workFolder)
console.log("Clone Success")

var unicodes = convert.mc("./svg/", "./resource/assets/minecraft/textures/font/")
console.log("Convert Success")

console.log(unicodes)
fs.writeFile('./resource/assets/minecraft/font/default.json', json.generateJson(unicodes), (err) => {
    if (err) throw err;
    console.log('Font File Success');
    
// package
const zip = new AdmZip();
zip.addLocalFolder("./resource");

const buffer = zip.toBuffer();
fs.writeFileSync("./build/AndrosDiscordEmojis.zip", buffer);
console.log('Done');
});

