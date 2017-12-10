function onLocalUrlError(URL) {
    return function(error) {
        PathLookup.lge(" error resolving URL: " + URL);
        PathLookup.lge("returned such error: " + error);
    }
}

function onErrorGetDir(newDirName) {
    return function(error) {
        PathLookup.lge('Error getting dir ' + newDirName + "\n" + error);
    }
}

function onErrorCreateFile(newFileName) {
    return function(error) {
        PathLookup.lge('Error creating  file ' + newFileName + "\n" + error);
    }
}

function onErrorReadFile(filename) {
    return function(error) {
        PathLookup.lge('Error reading  file ' + filename + "\n" + error);
    }
}

module.exports.onLocalUrlError = onLocalUrlError;
module.exports.onErrorGetDir = onErrorGetDir;
module.exports.onErrorCreateFile = onErrorCreateFile;
module.exports.onErrorReadFile = onErrorReadFile;


