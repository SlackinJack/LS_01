function time() {
    var theDate = new Date();
    var hour = theDate.getHours();
    var minute = theDate.getMinutes();
    var weekday = theDate.getDay();
    var month = theDate.getMonth();
    var date = theDate.getDate();
    var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    minute = addZero(minute);
    function addZero(minuteIn) {
        if (minuteIn < 10) {
            minuteIn = "0" + minuteIn;
        }
        return minuteIn;
    }

    weekday = weekdays[weekday];
    month = months[month];

    document.getElementById('clockTime').innerHTML = hour + ":" + minute;
    document.getElementById('clockCal').innerHTML = weekday + ", " + month + " " + date;

}

function timeInterval() {
    z = setInterval(time, 1000);
}