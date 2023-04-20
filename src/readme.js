const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
module.exports = {
    allToOne
}

async function allToOne(inputDir, outputFilePath) {
  try {
    // Read all PNG images
    const images = fs
      .readdirSync(inputDir)
      .filter(file => path.extname(file) === '.png')
      .map(file => path.join(inputDir, file))
      .filter(image => {
        try {
          sharp(image).metadata();
          return true;
        } catch (err) {
          console.log(`Error reading file ${image}: ${err.message}`);
          return false;
        }
      });

    // Calculate the aspect ratio of each image
    const imageRatios = await Promise.all(images.map(async image => {
      const metadata = await sharp(image).metadata();
      return metadata.width / metadata.height;
    }));

    // Calculate the width and height of the final image
    const imageCount = images.length;
    const totalRatio = imageRatios.reduce((sum, ratio) => sum + ratio, 0);
    const targetRatio = 16 / 9;
    const targetHeight = 1080;
    const targetWidth = targetRatio * targetHeight;
    const actualRatio = targetWidth / (targetHeight * imageCount / totalRatio);
    const width = actualRatio <= targetRatio ? targetWidth : targetHeight * imageCount / totalRatio;
    const height = actualRatio <= targetRatio ? width / targetRatio : targetHeight;

    // Create the final image
    const outputImage = sharp({
      create: {
        width: Math.round(width),
        height: Math.round(height),
        channels: 4,
        background: null
      }
    });

    // Resize and composite all images into the final image
    await Promise.all(images.map(async (imagePath, index) => {
      const buffer = await sharp(imagePath).resize(Math.round(width / imageCount), Math.round(height)).toBuffer();
      const x = Math.round(index * width / imageCount);
      const y = 0;
      return outputImage.composite([{ input: buffer, left: x, top: y }]);
    }));

    // Save the final image
    await outputImage.toFile(outputFilePath);

    // Return the output file path
    return outputFilePath;
  } catch (err) {
    throw err;
  }
}
