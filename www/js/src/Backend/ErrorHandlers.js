function onLocalUrlError(URL) {
    return function(error) {
        console.error(" error resolving URL: " + URL);
        console.error("returned such error: " + error);
    }
}

function onErrorGetDir(newDirName) {
    return function(error) {
        console.error('Error getting dir ' + newDirName + "\n" + error);
    }
}

function onErrorCreateFile(newFileName) {
    return function(error) {
        console.error('Error creating  file ' + newFileName + "\n" + error);
    }
}

function onErrorReadFile(filename) {
    return function(error) {
        console.error('Error reading  file ' + filename + "\n" + error);
    }
}

module.exports.onLocalUrlError = onLocalUrlError;
module.exports.onErrorGetDir = onErrorGetDir;
module.exports.onErrorCreateFile = onErrorCreateFile;
module.exports.onErrorReadFile = onErrorReadFile;


