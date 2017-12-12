var Debug = require('./Debug');

function onLocalUrlError(URL) {
    return function(error) {
        Debug.lge(" error resolving URL: " + URL);
        Debug.lge("returned such error: " + error);
    }
}

function onErrorGetDir(newDirName) {
    return function(error) {
        Debug.lge('Error getting dir ' + newDirName + "\n" + error);
    }
}

function onErrorCreateFile(newFileName) {
    return function(error) {
        Debug.lge('Error creating  file ' + newFileName + "\n" + error);
    }
}

function onErrorReadFile(filename) {
    return function(error) {
        Debug.lge('Error reading  file ' + filename + "\n" + error);
    }
}

module.exports.onLocalUrlError = onLocalUrlError;
module.exports.onErrorGetDir = onErrorGetDir;
module.exports.onErrorCreateFile = onErrorCreateFile;
module.exports.onErrorReadFile = onErrorReadFile;


