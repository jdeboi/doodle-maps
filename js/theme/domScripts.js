
var mapsShown = false;
var showInstructions = false;

function showMaps() {
    document.getElementById("header").style.display = "none";
    document.getElementById("mapContainer").style.visibility = "visible";
    document.getElementById("sideBar").style.display = "block";
    document.getElementById("doodleContainer").style.visibility = "visible";
    document.getElementById("doodle").style.visibility = "visible";
    document.getElementById("info").style.display = "block";
    // document.getElementById("sideBar").style.display = "block";
    mapsShown = true;
    // for picture taking
    // document.getElementById("mainNav").style.display = "none";
    // document.getElementById("navMap").style.display = "none";
}

function hideMaps() {
    document.getElementById("doodle").style.visibility = "hidden";
    document.getElementById("mapContainer").style.visibility = "hidden";
    document.getElementById("doodleContainer").style.visibility = "hidden";
}

function setDevDom() {
    document.getElementById("header").style.display = "none";
    document.getElementById("navMapContainer").style.display = "block";
    document.getElementById("mapContainer").style.display = "block";
}

function showLoading() {
    document.getElementById("header").style.display = "none";
    document.getElementById("loading").style.display = "block";
    document.getElementById("navMap").style.pointerEvents = "none";

}

function hideLoading() {
    document.getElementById("loading").style.display = "none";
    document.getElementById("navMap").style.pointerEvents = "all";
}

function toggleFAQ() {
    $('#faqModal').modal('toggle');
}

function toggleInstructions() {
    showInstructions = !showInstructions;
    if (showInstructions) {
        document.getElementById("instructionsContainer").style.display = "block";
        document.getElementById("directionsButton").innerHTML = "hide steps";
        hideMaps();
    }
    else {
        showMaps();
        document.getElementById("instructionsContainer").style.display = "none";
        document.getElementById("directionsButton").innerHTML = "show steps";
        // document.getElementById("mapContainer").style.display = "block";
        // document.getElementById("doodleContainer").style.visibility = "visible";
        // document.getElementById("instructions").style.display = "none";
    }
}