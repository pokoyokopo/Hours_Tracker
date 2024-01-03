// Calendar instances for start and end date/times. 
//They will save the selected times when the calendars are closed.

var startTimePicker = flatpickr("#startTime", {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    onClose: function(_, dateStr) {
        localStorage.setItem('tempStartTime', dateStr);
    }
});

var endTimePicker = flatpickr("#endTime", {
    enableTime: true,
    dateFormat: "Y-m-d H:i",
    onClose: function(_, dateStr) {
        var startTime = localStorage.getItem('tempStartTime');
        saveTimePair(startTime, dateStr);
        localStorage.removeItem('tempStartTime');
    }
});

// retrieve the the time pairs from local storage
function displayTimePairs() {
    var timePairs = JSON.parse(localStorage.getItem('timePairs')) || [];

    // get the table body element
    var tableBody = document.getElementById('timeTable').getElementsByTagName('tbody')[0];

    // clear the table body to prevent dupes
    tableBody.innerHTML = '';

    // loooop through the array
    for (var i = 0; i < timePairs.length; i++) {
        var pair = timePairs[i];

        // new row
        var row = tableBody.insertRow();

        // Add our corresponding times and difference cells to the row
        row.insertCell(0).innerText = pair.start;
        row.insertCell(1).innerText = pair.end;
        row.insertCell(2).innerText = pair.difference;
    }
}

// displayTimePairs when the page loads
window.onload = displayTimePairs;

// save and calculate time pairs

function saveTimePair(startTime, endTime) {
    var timePairs = JSON.parse(localStorage.getItem('timePairs')) || [];

    // Calculate the duration of the time pair
    var diff = new Date(endTime) - new Date(startTime);

    // Convert from milliseconds to hours
    var diffInHours = diff / 1000 / 60 / 60;

    // Add it all to an array

    timePairs.push({start: startTime, end: endTime, difference: diffInHours});

    localStorage.setItem('timePairs', JSON.stringify(timePairs));

    // now with display update functionality!
    displayTimePairs();
}