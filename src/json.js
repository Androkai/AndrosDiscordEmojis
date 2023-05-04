module.exports = {
    generateJson
}

function generateJson(unicodeArray) {
    let providers = [];
    unicodeArray.forEach((unicode) => {
        const codePoint = parseInt(unicode, 16); // Convert hexadecimal string to code point
        const char = String.fromCodePoint(codePoint); // Convert code point to character
        const json = {
            "type": "bitmap",
            "file": `minecraft:font/${unicode}.png`,
            "height": 7,
            "ascent": 7,
            "chars": [char]
        };
        providers.push(json);
    });
    return JSON.stringify({
        "providers": providers
    }, null, 2);
}