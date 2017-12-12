var Debug = require("./Debug");
var ErrorHandlers = require("./ErrorHandlers");
var CourseClass = require('./data classes/CourseClass');
var FileWriter = require('./FileWriter');


var userCourses = [];
var coursesJsonName = "userCourses.json";

var filteredCourses = [
    new CourseClass.Course("JavaScript", 189),
    new CourseClass.Course("Основи комп'ютерних алгоритмів на Java", 131)
]

// success takes 0 args, 
// is run when userCourses where successfully retrieved from disk
// failure takes string representing error
function coursesSerialized(success, failure) {

    window.resolveLocalFileSystemURL(Debug.cacheRootPath + coursesJsonName, function(fileEntry){

        fileEntry.file(function (file) {
            var reader = new FileReader();

            reader.onloadend = function (e) {
                try {
                    userCourses = JSON.parse(this.result);
                    Debug.lg(userCourses);

                    success();
                } catch(e) {
                    failure(e);
                }
            };

            reader.readAsText(file);

        }, function(error) {
            failure( "cannot read file : "+ Debug.cacheRootPath + coursesJsonName)
        });

    }, function(error) {
        failure("cannot find URL : " + Debug.cacheRootPath + coursesJsonName);
    });

}

// delete courses that are marked as done from disk(if deadline has passed), 
// cache those that are not longer than week from now
function update() {

}

// pass user - filtered array of courses as arg,
// serializes it to be able to use in next sessions
function saveUserCourses() {
    window.resolveLocalFileSystemURL(Debug.cacheRootPath, function(cacheRootDir){

        cacheRootDir.getFile(coursesJsonName, {create : true}, function(file) {
            // write json
            writeObjToFile(file, filteredCourses);


        }, ErrorHandlers.onErrorCreateFile(Debug.cacheRootPath + coursesJsonName));
    }, ErrorHandlers.onErrorGetDir(Debug.cacheRootPath));
}



//#region 
function writeObjToFile(file, obj) {
    Debug.lg("JSONNED obj : " + JSON.stringify(obj));
    FileWriter.write(file, new Blob([JSON.stringify(obj)]));
}

//#endregion

module.exports.coursesSerialized = coursesSerialized;
module.exports.saveUserCourses = saveUserCourses;