//Initialize FireBase
var config = {
    apiKey: "AIzaSyA5MxHwLn7VTVptiXinJJHc5CQx3vs1-FI",
    authDomain: "train-time-89abb.firebaseapp.com",
    databaseURL: "https://train-time-89abb.firebaseio.com",
    projectId: "train-time-89abb",
    storageBucket: "",
    messagingSenderId: "17120482066"
};
firebase.initializeApp(config);

//Gloabal Variables 
var database = firebase.database();
var name = "";
var destination = "";
var time = "";
var frequency = "";

//When submit button is clicked, push the data to firebase
$("#submitBtn").on("click", function (event) {
    event.preventDefault();
    name = $("#newTrain").val().trim();
    destination = $("#newDestination").val().trim();
    time = $("#newTime").val().trim();
    frequency = $("#newFrequency").val();


    database.ref(destination).set({
        name: name,
        destination: destination,
        time: time,
        frequency: frequency,
    });
});

//When data is added to the database, add a row to the table
database.ref().on("child_added", function (childSnapshot, prevChildKey) {
    var trainName = $("<td>").text(childSnapshot.val().name); //Creates a cell for name
    var trainDestination = $("<td>").text(childSnapshot.val().destination); //Creates a cell for destination
    var trainFrequency = $("<td>").text(childSnapshot.val().frequency); //Creates a cell for frequency

    //Math for making the time in AM/PM format and finding how many minutes away the train is
    var trainStart = childSnapshot.val().time;
    var interval = childSnapshot.val().frequency;
    var trainStart = moment().diff(moment(trainStart, "hh:mm A"), 'm');
    var trainNext = trainStart % interval;
    var timeMinsAway = interval - trainNext;
    var timeNext = moment().add(timeMinsAway, 'm').toDate();
    var prettyTime = moment(timeNext).format("hh:mm A");
    var upcomingTrain = $("<td>").text(timeMinsAway);
    var trainTime = $("<td>").text(prettyTime);

    //Creates the new button for removing the train
    // console.log() 
    var newButton = $("<button>")
        .addClass("btn")
        .addClass("btn-secondary")
        .addClass("removeTrain")
        .addClass(trainName)
        .attr("id", childSnapshot.val().destination)
        .text("x");
    var buttonCell = $("<td>").html(newButton)

    var newRow = $("<tr>");
    newRow.append(trainName)
        .append(trainDestination)
        .append(trainTime)
        .append(trainFrequency)
        .append(upcomingTrain)
        .append(buttonCell);
    $("#trainTable").append(newRow)
});

//Removes from the page...but not the database...needs work
$("body").on("click", ".removeTrain", function (e) {
    console.log(e);
    $(this).closest("tr").remove();
    var removeMe = e.target.id;
    console.log(removeMe);
    database.ref().child(removeMe).remove();
})
