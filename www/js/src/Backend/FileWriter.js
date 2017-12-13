var Debug = require('./Debug');
var ErrorCommenter = require('./ErrorCommenter');

// dataObj type is Blob
function write(fileEntry, dataObj, success, failure) {
    // Create a FileWriter object for our FileEntry (log.txt).

    Debug.lg("dataobj " + dataObj);
    // delete prev contents
    fileEntry.createWriter((fileWriter)=>fileWriter.truncate(0));

    fileEntry.createWriter(function (fileWriter) {

        fileWriter.onwriteend = function() {
            Debug.lg("Successful file write : " + fileEntry);
            Debug.lg(dataObj);
            success();
        };

        fileWriter.onerror = function (e) {
            console.error("Failed file write: " + fileEntry + "\nerror : " + e.toString());
        };

        fileWriter.write(dataObj);
    }, function(error) {
        commentedError = ErrorCommenter.addCommentPrefix(error, "Error creating writer for " + fileEntry);
        failure(commentedError);
    });
}

function writeObjToFile(file, obj, failure) {
    Debug.lg("JSONNED obj : " + JSON.stringify(obj));
    write(file, new Blob([JSON.stringify(obj)]), failure);
}

module.exports.write = write;
module.exports.writeObjToFile = writeObjToFile;