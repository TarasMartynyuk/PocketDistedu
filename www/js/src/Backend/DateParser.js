var Debug = require('./Debug');

var monthsLookup = {
    "січня" : 0,
    "лютого" : 1,
    "березня" : 2,
    "квітня" : 3,
    "травня" : 4,
    "червня" : 5,
    "липня" : 6,
    "серпня" : 7,
    "вересня" : 8,
    "жовтня" : 9,
    "листопада" : 10,
    "грудня" : 11,
}

// input - string of type "понеділок  11 грудня 2017, 23:55"
// returns date object
function parseUkrDateStr(dateStr) {
    var regexp = /^([а-яА-ЯіІїЇєЄщЩ]+) +([0-9]+) +([а-яА-ЯіІїЇєЄщЩ]+) +([0-9]+), +([0-9]+):([0-9]+)$/i;
    var match = regexp.exec(dateStr);
    var day = match[2];
    var month = monthsLookup[match[3]];
    var year = match[4];
    var hour = match[5];
    var minute = match[6];

    var dateObj = new Date(year, month, day, hour, minute);
    return dateObj;
}

module.exports.parseUkrDateStr = parseUkrDateStr;