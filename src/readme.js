const fs = require('fs');
const PNG = require('pngjs').PNG;
module.exports = {
    allToOne
}

function allToOne(where, output) {
// Get all PNG files
const pngFiles = fs.readdirSync(where).filter(file => file.endsWith('.png'));

// Calculate the width and height of each PNG file
const pngDimensions = pngFiles.map(file => {
  const png = PNG.sync.read(fs.readFileSync(file));
  return {
    width: png.width,
    height: png.height
  }
});

// Calculate the width and height of the final photo
const totalWidth = Math.max(...pngDimensions.map(dim => dim.width));
const totalHeight = Math.ceil(pngDimensions.reduce((sum, dim) => sum + dim.height, 0) / pngFiles.length * 16 / 9);

// Create a new PNG file and set the width and height
const result = new PNG({ width: totalWidth, height: totalHeight });

// Copy all PNG files into the new PNG file
let currentY = 0;
pngFiles.forEach((file, index) => {
  const png = PNG.sync.read(fs.readFileSync(file));
  const startY = currentY;
  png.data.copy(result.data, totalWidth * currentY * 4, 0, png.width * png.height * 4);
  currentY += png.height;
  // Add a horizontal line in the new PNG file
  if (index !== pngFiles.length - 1) {
    for (let x = 0; x < totalWidth; x++) {
      const y = Math.floor(currentY * 16 / 9);
      const i = (y * totalWidth + x) * 4;
      result.data[i] = 255;
      result.data[i + 1] = 255;
      result.data[i + 2] = 255;
      result.data[i + 3] = 255;
    }
    currentY = Math.floor(currentY * 16 / 9);
  }
});

// Save the result as a new PNG file
fs.writeFileSync(output, PNG.sync.write(result));
}