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
        
        const png = sharp(oldFile)
            .resize(64, 64)
            .png()
            .toBuffer();
        fs.writeFile(newFile, png, (err) => {
            if (err) throw err;
        });
        
        ulist.push(ucode)
    });
    return ulist;
}
