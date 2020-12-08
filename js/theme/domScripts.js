var mapsShown = false;
var showInstructions = false;
var isMobile = false;
// if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
//     setMobile();
// }
// else if (window.innerWidth < 550) {
//     setMobile();
// }

// takePics();

function setMobile() {
    // console.log("MOBILE")
    isMobile = true;
    // document.getElementById("introVid").style.display = "none";
    // document.getElementById("header").classList.add("bgimg");
    document.getElementById("sideBarContainer").style.display = "none";
    document.getElementById("directionsButtonContainerMobile").style.display = "none";
}

function showMaps() {
    mapsShown = true;
    // document.getElementById("introVid").style.display = "none";
    document.getElementById("header").style.display = "none";
    document.getElementById("mapContainer").style.visibility = "visible";
    document.getElementById("doodleContainer").style.visibility = "visible";
    document.getElementById("doodle").style.visibility = "visible";
    document.getElementById("info").style.display = "block";

    // if (!isMobile) {
        document.getElementById("sideBarContainer").style.display = "block";
        document.getElementById("directionsButtonContainerMobile").style.display = "block";
    // }
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

function takePics() {
    document.getElementById("header").style.display = "none";
    document.getElementById("mapContainer").style.visibility = "visible";
    document.getElementById("sideBarContainer").style.display = "none";
    document.getElementById("doodleContainer").style.visibility = "visible";
    document.getElementById("doodle").style.visibility = "visible";
    document.getElementById("info").style.display = "block";
    document.getElementById("mainNav").style.display = "none";
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
        hideMaps();
        document.getElementById("instructionsContainer").style.display = "block";
        document.getElementById("directionsButton").innerHTML = "hide steps";
    }
    else {
        showMaps();
        document.getElementById("instructionsContainer").style.display = "none";
        document.getElementById("directionsButton").innerHTML = "show steps";
    }
}