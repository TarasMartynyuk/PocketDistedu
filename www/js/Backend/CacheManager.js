
function CacheManager() {

    window.resolveLocalFileSystemURL(cordova.file.applicationDirectory, function (weekDir) {
        alert("found directory : " + cordova.file.applicationDirectory);
    }, function(error) {
        alert("NOT found directory : " + cordova.file.applicationDirectory);
        
    });

}



function onLocalUrlError(URL, error) {
    console.log(" error resolving URL: " + URL);
    console.log("returned such error: " + error);
}