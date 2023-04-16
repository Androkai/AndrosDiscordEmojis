const fs = require('fs')
const sharp = require("sharp")
const path = require('path')
module.exports = {
    mc
}

function mc(from, to, ulist = []) {
    const files = fs.readdirSync(from);
    const svgFiles = files.filter((file) => {
        return path.basename(file).indexOf('-') == -1 
        && path.extname(file).toLowerCase() === '.svg';
    });
   svgFiles.forEach(file => {
        let ucode = path.basename(file, ".svg")
        let newName = ucode + ".png"
        sharp(from + file)
            .resize(64, 64)
            .png()
            .toFile(to + newName)
            .then(function(info) {
        }).catch (function(err) {
            console.log(`${ucode} 转换失败`)
            throw err
        })
        ulist.push(ucode)
    });
    return ulist;
}
