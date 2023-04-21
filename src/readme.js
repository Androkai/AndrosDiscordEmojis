const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
module.exports = {
    combinePngs
}

/**
 * Combine all PNG images in the specified directory into a single PNG image with a ratio of 16:9
 * @param {string} inputDir The directory where the original PNG images are stored
 * @param {string} outputPath The directory and filename where the combined PNG image will be saved
 * @returns {Promise<string>} The file path of the combined PNG image
 */
async function combinePngs(inputDir, outputPath) {
  const ratio = 16 / 9; // The target ratio
  // Read all files in the directory
  const files = await fs.promises.readdir(inputDir);
  
  // Filter out PNG files
  const pngFiles = files.filter(file => path.extname(file) === '.png');
  
  // Calculate the width and height of the combined image
  const width = Math.floor(pngFiles.length / ratio);
  const height = Math.floor(width / ratio);
  
  // Create a Sharp instance
  const sharpInstance = sharp({
    create: {
      width: width,
      height: height,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  });
  
  // Loop through the PNG files and composite them into the combined image
  pngFiles.forEach((file, index) => {
    sharpInstance.composite([{ input: `${inputDir}/${file}`, gravity: 'northwest', top: Math.floor(index / ratio) * Math.floor(height / ratio), left: Math.floor((index % ratio) * Math.floor(width / ratio)), scale: 2 }]);
  });
  
  // Create the output directory if it does not exist
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Save the combined image and return the file path
  const { filename } = await sharpInstance.toFile(outputPath);
  return filename;
}
