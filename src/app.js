const convert = require('./convert')
const json = require('./json')

const AdmZip = require('adm-zip');
const fs = require('fs')
const goGitIt = require('go-git-it')
const path = require('path')

// Custom variable
const workDir = path.resolve('./run/')
const buildDir = path.join(workDir, 'build/')
const buildName = 'AndrosDiscordEmoji.zip'

const version = [{ 6: "1.16.2+" }, { 7: "1.17.x" }, { 8: "1.18.x" }];

function dir(target) {
  if (!fs.existsSync(target)) {
    fs.mkdirSync(target, { recursive: true });
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

// Do not modify
// All in workDir
const svgDir = path.join(workDir, 'svg/')
const resourceDir = path.join(workDir, 'resource/')
const pngDir = path.join(resourceDir, 'assets/minecraft/textures/font')

dir(workDir)
dir(buildDir)
dir(svgDir)
copyFolderSync('./resource/', resourceDir)
dir(path.join(resourceDir, 'assets/minecraft/font'))
dir(pngDir)

// Clone GitHub Repo
// assets/svg/
goGitIt('https://github.com/twitter/twemoji/tree/master/assets/svg', workDir)
console.log("Clone Success")

// Convert
const unicodes = convert.mc(svgDir, pngDir)
console.log("Convert Success")

// Generate Json
console.log(unicodes)
fs.writeFile(path.join(resourceDir, 'assets/minecraft/font/default.json'), json.generateJson(unicodes), (err) => {
  if (err) throw err;
  console.log('Font File Success');

  // Zip
  const zip = new AdmZip();
  zip.addLocalFolder(resourceDir);
  const buffer = zip.toBuffer();
  fs.writeFileSync(path.join(buildDir, buildName), buffer);

  console.log('Done');
});

