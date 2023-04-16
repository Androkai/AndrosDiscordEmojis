const convert = require('./convert')
const json = require('./json')
const AdmZip = require('adm-zip');
const fs = require('fs')
const shell = require('shelljs')
const goGitIt = require('go-git-it')
const path = require('path')

// Custom variable
const workDir = path.resolve('./run/')
const buildDir = path.join(workDir, 'build/')
const buildName = 'AndrosDiscordEmojis.zip'

function dir(target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target);
    }
}
async function copyFolderAsync(source, target) {
  const files = await fs.promises.readdir(source);

  for (const file of files) {
    const sourcePath = path.join(source, file);
    const targetPath = path.join(target, file);

    const stats = await fs.promises.stat(sourcePath);

    if (stats.isFile()) {
      await fs.promises.copyFile(sourcePath, targetPath);
    }

    if (stats.isDirectory()) {
      await copyFolderAsync(sourcePath, targetPath);
    }
  }
}

// Do not modify
const svgDir = path.join(workDir, 'svg/')
const resourceDir = path.join(workDir, 'resource/')

dir(workDir)
dir(buildDir)
dir(svgDir)
copyFolderAsync('./resource/', resourceDir)

// Clone GitHub Repo
// assets/svg/
goGitIt('https://github.com/twitter/twemoji/tree/master/assets/svg', workDir)
console.log("Clone Success")

// Convert
const unicodes = convert.mc(svgDir, path.join(resourceDir, 'assets/minecraft/textures/font/'))
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

