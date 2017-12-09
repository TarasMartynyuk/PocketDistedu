// handles distedu data storage, removal
// and data requests
function CacheManager() {
    // for testing, place them in root;
    this.cacheRootPath = "filesystem:http://192.168.0.103:3000/persistent/";
    this.weekDirName = "Week/";
    this.recoursesPath = this.cacheRootPath + this.weekDirName + "Resources/";
    this.assignmentsPath = this.cacheRootPath + this.weekDirName + "Assignments/";
    
    CacheManager.prototype.checkIfCachePresent(this.cacheRootPath,  function (dir) {
        console.log("found directory : " + dir.toURL());
        }, function(error) {
             console.log("NOT found directory : " + cacheRootPath);
        });
        // console.log(fs.root.toInternalURL());
        
            // fs.root.getFile("newPersistentFile.txt", { create: true, exclusive: false }, function (fileEntry) {
                
            //     console.log("fileEntry is file? " + fileEntry.isFile.toString());
            //     console.log(fileEntry.name);
            //     console.log(fileEntry.fullPath);
                
            //     // fileEntry.name == 'someFile.txt'
            //     // fileEntry.fullPath == '/someFile.txt'
            //     // writeFile(fileEntry, null);
            // }, onErrorCreateFile("new1.txt"));

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
}

CacheManager.prototype = {

    init : function (fsRoot){
        // this.createDirectory(fsRoot, "weekDir");
    },
    //#region helpers

    // calls onPresentCallback if distedu files are already on disk,
    // else onAbsentCallback
    checkIfCachePresent : function(cacheRootPath, onPresentCallback, onAbsentCallback) {

        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
            
            window.resolveLocalFileSystemURL(cacheRootPath, onPresentCallback, onAbsentCallback);
            
        }, function(error) {
            console.log(error);
        });
    },

    createCacheDirs : function() {
        window.resolveLocalFileSystemURL(fs.root.toURL() + "Week", function (dir) {
            console.log("found directory : " + dir.toURL());


        }, function(error) {
            console.log("NOT found directory : " + fs.root.toURL() + "Week");
        });
    },

    createDirectory : function (rootDirEntry, newDirName) {
        rootDirEntry.getDirectory(newDirName, { create: true }, function (dirEntry) {
            console.log('created dir ' + dirEntry.toURL());
        }, this.onErrorGetDir(newDirName));
    },

    //#region error handlers
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
    
    //#endregion
}

function Log(text) {
    $('#console').text(text);
}







