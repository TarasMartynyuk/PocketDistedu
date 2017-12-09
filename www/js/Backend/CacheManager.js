// handles distedu data storage, removal
// and data requests
function CacheManager() {
    // for testing, place them in root;
    this.cacheRootPath = "filesystem:http://192.168.0.103:3000/persistent/";
    // this.cacheRootPath = ;
    this.weekDirName = "Week/";

    var resourcesDirName = "Resources/";
    var assignmentsDirName = "Assignments/";

    this.recoursesPath = this.cacheRootPath + this.weekDirName + resourcesDirName;
    this.assignmentsPath = this.cacheRootPath + this.weekDirName + assignmentsDirName;
    
    // the variable created with var will be visible in callback scope
    var instance = this;

    // var test = "NOT MEANT TO BE FOUND";
    // var test = this.cacheRootPath + this.weekDirName ;
    var test = this.assignmentsPath ;
    
    
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
        
        window.resolveLocalFileSystemURL(test, function (dir) {

            console.log("found directory : " + dir.toURL());
            }, function(error) {
                console.log("NOT found directory : " + test);
                // instance.createCacheDirs(instance, resourcesDirName, assignmentsDirName);
            },
        function(error) {
            console.log(error);
        });
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

    //#region helpers
    createCacheDirs : function(instance, resourcesDirName, assignmentsDirName) {
        console.log("createCacheDirs\n\n");
        // console.log(instance.cacheRootPath);

        window.resolveLocalFileSystemURL(instance.cacheRootPath, function (rootDir) {
            console.log("found directory : " + rootDir.toURL());
            instance.createDirectory(rootDir, instance.weekDirName, function(weekDir){
                console.log(weekDir.toURL());
                instance.createDirectory(weekDir, resourcesDirName);
                instance.createDirectory(weekDir, assignmentsDirName);

            });
            

        }, instance.onLocalUrlError(instance.cacheRootPath));
    },

    // onCreatedCallback recieves created dir as argument
    createDirectory : function (rootDirEntry, newDirName, onCreatedCallback) {
        onCreatedCallback = onCreatedCallback || function(dirEntry) {
            console.log('created dir ' + dirEntry.toURL());
        };
        rootDirEntry.getDirectory(newDirName, { create: true }, onCreatedCallback, this.onErrorGetDir(newDirName));
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







