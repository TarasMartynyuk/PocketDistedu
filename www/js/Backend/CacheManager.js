
function CacheManager() {

    

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
    //         console.log('file system root: ' + fs.root.fullPath);  
            // fs.root.getFile("newPersistentFile.txt", { create: true, exclusive: false }, function (fileEntry) {


                weekDirPath = cordova.file.dataDirectory;
                window.resolveLocalFileSystemURL(weekDirPath, function (weekDir) {
                    Log("found directory : " + weekDirPath);
                }, function(error) {
                    Log("NOT found directory : " + weekDirPath);
                });
            //     console.log("fileEntry is file? " + fileEntry.isFile.toString());
            //     console.log(fileEntry.name);
            //     console.log(fileEntry.fullPath);
                
            //     // fileEntry.name == 'someFile.txt'
            //     // fileEntry.fullPath == '/someFile.txt'
            //     // writeFile(fileEntry, null);
            // }, onErrorCreateFile("new1.txt"));

            // window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(fs){
            //     console.log("found");
            // }, function(error) {
            //     console.error(error);
            // });
            // console.log(cordova.file.dataDirectory);
            // fs.root.getFile("newPersistentFile.txt", { create: true, exclusive: false }, function (fileEntry) {
                
            //         // console.log("fileEntry is file? " + fileEntry.isFile.toString());
            //         // console.log(fileEntry.name);
            //          console.log(fileEntry.toURL() + "FOUND");
                        
            //         // fileEntry.name == 'someFile.txt'
            //         // fileEntry.fullPath == '/someFile.txt'
            //         // writeFile(fileEntry, null);
            
            // }, function(error){
            //     console.log("NOT FOUND");
            // });

            // root = "filesystem:" + cordova.file.applicationDirectory
            // console.log(root);
            // window.resolveLocalFileSystemURL(root, function (dir) {

            //     console.log(" found root");

            // }, onLocalUrlError(root));
            // createDirectory(root, "NewDir");

            // createDirectory(cord)
        }, function(error) {
            console.log(error);
        });

}


CacheManager.prototype = {
    //#region helpers
    createDirectory : function (rootDirEntry, newDirName) {
        rootDirEntry.getDirectory(newDirName, { create: true }, function (dirEntry) {
            console.log('created dir ' + dirEntry);
        }, onErrorGetDir(newDirName));
    },

    onLocalUrlError : function (URL) {
        return function(error) {
            console.error(" error resolving URL: " + URL);
            console.error("returned such error: " + error);
        }
    },

    onErrorGetDir : function (newDirName) {
        return function(error) {
            console.error('Error getting dir ' + newDirName + "\n" + error);
        }
    },

    onErrorCreateFile : function (newFileName) {
        return function(error) {
            console.error('Error creating  file ' + newFileName + "\n" + error);
        }
    }
    //#endregion
}

function Log(text) {
    $('#console').text(text);
}







