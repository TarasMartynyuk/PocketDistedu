// class that checks wether the current week
// is on even with the one that cacheManager saved files for
function DateChecker() {
    this.firstDayOfSemester = this.getFirstDayOfSemester();
}

weekNumberFileName : "weekNumber.txt",
function getFirstDayOfSemester(){
    return null;
}
// true if data in weekNumberFileName corresponds to real date
function upToDate() {
    
}
function update() {
    var today = new Date();
    var dd = today.getTime();
    console.log(dd);
}
function weekDifference(d1, d2) {
    var t2 = d2.getTime();
    var t1 = d1.getTime();

    return parseInt((t2-t1)/(24*3600*1000*7));
}
