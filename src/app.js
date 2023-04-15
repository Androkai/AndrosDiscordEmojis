const convert = require('./convert')
const json = require('./json')
const AdmZip = require('adm-zip');
const fs = require('fs')
const shell = require('shelljs')

const path = './run'
shell.mkdir(path)
shell.cd(path)
shell.exec('git clone https://github.com/twitter/twemoji')
shell.cd("../")

var unicodes = convert.mc("./run/twemoji/assets/svg/", "./resource/assets/minecraft/textures/font/")
console.log(unicodes)
fs.writeFile('./resource/assets/minecraft/font/default.json', json.generateJson(unicodes), (err) => {
    if (err) throw err;
    console.log('Font Success');
});

// package
const zip = new AdmZip();
zip.addLocalFolder("./resource");

const buffer = zip.toBuffer();
fs.writeFileSync("AndrosDiscordEmojis.zip", buffer);