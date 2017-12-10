// class that checks wether the current week
// is on even with the one that cacheManager saved files for
function DateChecker() {
    this.firstDayOfSemester = this.getFirstDayOfSemester();
}

DateChecker.prototype = {
    weekNumberFileName : "filesystem:http://192.168.0.103:3000/persistent/weekNumber.txt",
    getFirstDayOfSemester : function(){
        return null;
    },
    // true if data in weekNumberFileName corresponds to real date
    upToDate : function() {

    },
    update : function() {
        var today = new Date();
        var dd = today.getTime();
        console.log(dd);
    },
    weekNumberOf : function (d1, d2) {
        var t2 = d2.getTime();
        var t1 = d1.getTime();
    
        return parseInt((t2-t1)/(24*3600*1000*7));
    }
}



{/* <script type="text/javascript" src="js/Backend/ErrorHandlers.js"></script>    
    <script type="text/javascript" src="js/Backend/PathLookup.js"></script>
    <script type="text/javascript" src="js/Backend/AccountManager.js"></script>
    <script type="text/javascript" src="js/Backend/CacheManager.js"></script>
    <script type="text/javascript" src="js/Backend/DateChecker.js"></script>
    <script type="text/javascript" src="js/index.js"></script> */}