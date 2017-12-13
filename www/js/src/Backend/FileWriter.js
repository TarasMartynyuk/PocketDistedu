var Debug = require('./Debug');
// dataObj type is Blob
function write(fileEntry, dataObj) {
    // Create a FileWriter object for our FileEntry (log.txt).

    Debug.lg("dataobj " + dataObj);
    // delete prev contents
    fileEntry.createWriter((fileWriter)=>fileWriter.truncate(0));

    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
            Debug.lg("Successful file write : " + fileEntry);
            Debug.lg(dataObj);
        };

        fileWriter.onerror = function (e) {
            console.error("Failed file write: " + fileEntry + "\nerror : " + e.toString());
        };

        fileWriter.write(dataObj);
    }, function(error) {
        Debug.lge('could not create writer for file: ' + fileEntry);
        Debug.lge('returned such error : ' + error);
    });
}

function writeObjToFile(file, obj) {
    Debug.lg("JSONNED obj : " + JSON.stringify(obj));
    write(file, new Blob([JSON.stringify(obj)]));
}

module.exports.write = write;
module.exports.writeObjToFile = writeObjToFile;