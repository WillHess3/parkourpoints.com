//athlete search
function setSearchBarInitialText() {
    const searchBar = document.getElementById("athlete-search-bar");

    const name = sessionStorage.getItem("athleteName");
    sessionStorage.clear();

    if (name == null) {
        searchBar.value = "";
        return;
    }

    searchBar.value = name;
}

//view athlete profile
function viewAthleteProfile(athleteID) {
    sessionStorage.setItem("athleteID", parseInt(athleteID));
    location.href = "athleteProfile.html";
}

//view gym
function viewGymProfile(gymID) {
    sessionStorage.setItem("gymID", parseInt(gymID));
}

//build page
let athletesData;
let gymsData;

document.addEventListener("DOMContentLoaded", buildPage);

async function buildPage() {
    athletesData = await getSheetData("Athletes", "SELECT A,B,C,D");
    gymsData = await getSheetData("Gyms", "SELECT A,B");

    setSearchBarInitialText();

    onAthleteSearchClicked();
}

function onAthleteSearchClicked() {
    document.getElementById("athlete-list").innerHTML = "";

    let text = document.getElementById("athlete-search-bar").value;

    relevantAthletes = [];
    for (let i = 0; i < athletesData.length; i++) {
        if (isLooseSubstring(text, athletesData[i]["name"])) {
            relevantAthletes.push(athletesData[i]);
        }
    }

    relevantAthletes.sort((a, b) => parseInt(b["parkour points"] - a["parkour points"]));

    document.getElementById("athlete-list").innerHTML = "";
    for (let i = 0; i < relevantAthletes.length; i++) {
        createAthleteRow(relevantAthletes[i]);
    }
}

function createAthleteRow(athleteData) {
    let athleteID = athleteData["athlete id"];
    let name = athleteData["name"];
    let gymID = parseInt(athleteData["gym id"]);
    let gym = gymsData[gymID - 1]["gym name"];
    let parkourPoints = athleteData["parkour points"];

    document.getElementById("athlete-list").innerHTML += `<div class="list-entry"><h3 class="entry-name">${name}</h3><a href="gym.html" onclick="viewGymProfile(${gymID})" class="entry-info"><strong>Gym:</strong> ${gym}</a><p class="entry-info"><strong>Parkour Points:</strong> ${parkourPoints}</p><button class="entry-button" onclick="viewAthleteProfile(${athleteID})">View Stats</button></div>`;
}

function isLooseSubstring(a, b) {
    const normalize = str => str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    return normalize(b).includes(normalize(a));
}