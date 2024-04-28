// Calendar instances for start and end date/times. 
//They will save the selected times when the calendars are closed.

var startTimePicker = flatpickr("#startTime", {
    enableTime: true,
    dateFormat: "m-d-Y h:i K",
    onClose: function(_, dateStr) {
        localStorage.setItem('tempStartTime', dateStr);
    }
});

var endTimePicker = flatpickr("#endTime", {
    enableTime: true,
    dateFormat: "m-d-Y h:i K",
    onClose: function(_, dateStr) {
        var startTime = localStorage.getItem('tempStartTime');
        saveTimePair(startTime, dateStr);
        localStorage.removeItem('tempStartTime');
        setTimeout(function() {
            startTimePicker.clear();
            document.getElementById('startTime').value = '';
            endTimePicker.clear();
            document.getElementById('endTime').value = '';
        }, 0);
    }
});

// retrieve the the time pairs from local storage
// retrieve the the time pairs from local storage
function displayTimePairs() {
    var timePairs = JSON.parse(localStorage.getItem('timePairs')) || [];

    // get the table body element
    var tableBody = document.getElementById('timeTable').getElementsByTagName('tbody')[0];

    // clear the table body to prevent dupes
    tableBody.innerHTML = '';

    // initialize total hours
    var totalHours = 0;

    // loop through the array
    for (var i = 0; i < timePairs.length; i++) {
        var pair = timePairs[i];

        // new row
        var row = tableBody.insertRow();

        // Check/Selection box for each set of timePairs
        var checkboxCell = row.insertCell(0);
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkboxCell.id = 'checkbox' + i;
        checkboxCell.appendChild(checkbox);

        // Add our corresponding times and difference cells to the row
        row.insertCell(1).innerText = pair.start;
        row.insertCell(2).innerText = pair.end;
        row.insertCell(3).innerText = pair.difference;

        // Add the difference to total hours
        totalHours += pair.difference;
    }

    // Add a row for the total hours
    var totalRow = tableBody.insertRow();
    totalRow.insertCell(0); // Empty cell for symmetry with other rows
    totalRow.insertCell(1); // Empty cell
    totalRow.insertCell(2).innerText = 'Total Hours:';
    totalRow.insertCell(3).innerText = totalHours;
}

// displayTimePairs when the page loads
window.onload = displayTimePairs;

// save and calculate time pairs

function saveTimePair(startTime, endTime) {
    // check for missing fields
    if (!startTime || !endTime) {
        console.log('Must submit both start and end time.');
        return;
    }
    var timePairs = JSON.parse(localStorage.getItem('timePairs')) || [];

    // Calculate the duration of the time pair
    var diff = new Date(endTime) - new Date(startTime);

    // Convert from milliseconds to hours
    var diffInHours = parseFloat((diff / 1000 / 60 / 60).toFixed(3));

    // Add it all to an array

    timePairs.push({start: startTime, end: endTime, difference: diffInHours});

    localStorage.setItem('timePairs', JSON.stringify(timePairs));

    // now with display update functionality!
    displayTimePairs();
}

function deleteSelectedTimePairs() {
    // get table body
    var tableBody = document.getElementById('timeTable').getElementsByTagName('tbody')[0];

    var timePairs = JSON.parse(localStorage.getItem('timePairs')) || [];

    // loop rows in reverse to handle index changes from deletion
    for (var i = tableBody.rows.length - 1; i >= 0; i--) {
        var row = tableBody.rows[i];

        // if checkbox in row is checked, remove time pair from array
        if (row.cells[0].getElementsByTagName('input')[0].checked) {
            timePairs.splice(i, 1);
        }
    }

    // update localStorage
    localStorage.setItem('timePairs', JSON.stringify(timePairs));

    displayTimePairs();
}

// listen for delete button click
document.getElementById('deleteButton').addEventListener('click', deleteSelectedTimePairs);