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
        const ucode = path.basename(file, '.svg')
        
        const oldFile = path.join(from, file)
        const newFile = path.join(to, ucode + '.png')
        
        sharp(oldFile)
            .resize(64, 64)
            .png()
            .toFile(newFile, (err, info) => {
                if (err) {
                    console.log(`${newFile} Convert Fail`)
                    throw err
                }
            });
        ulist.push(ucode)
    });
    return ulist;
}
