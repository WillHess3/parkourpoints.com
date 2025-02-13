//athlete search
const athleteSearchButton = document.getElementById("athlete-search-button");
const athleteSearchBar = document.getElementById("athlete-search-bar");

athleteSearchButton.onclick = searchAthlete;

function searchAthlete() {
    sessionStorage.setItem("athleteName", athleteSearchBar.value);
    location.href = "athletes.html";
}

//upcoming comps full list
const allUpcomingCompsButton = document.getElementById("all-upcoming-comps");

allUpcomingCompsButton.onclick = seeFullUpcomingCompsList;

function seeFullUpcomingCompsList() {
    location.href = "upcoming.html";
}

//upcoming comp more info
function upcomingCompMoreInfo(upcomingCompID) {
    sessionStorage.setItem("upcomingCompID", parseInt(upcomingCompID));
    location.href = "upcomingCompetition.html";
}

//leaderboards list
const allLeaderboardsButton = document.getElementById("leaderboard-lookup");

allLeaderboardsButton.onclick = seeLeaderboardList;

function seeLeaderboardList() {
    location.href = "leaderboards.html";
}

//see full leaderboard
function seeFullLeaderboard(leaderboardID) {
    sessionStorage.setItem("competitionID", parseInt(leaderboardID));
    location.href = "leaderboard.html";
}

//athlete profile
function seeAthleteProfile(athleteID) {
    sessionStorage.setItem("athleteID", parseInt(athleteID));
    location.href = "athleteProfile.html";
}

//build page
document.addEventListener("DOMContentLoaded", buildPage);

async function buildPage() {
    const leaderboardsData = await getSheetData("Leaderboards info", "SELECT A,B,D,E");
    const upcomingCompsData = await getSheetData("Upcoming competitions", "SELECT A,B,C,D,F");
    const gymsData = await getSheetData("Gyms", "SELECT A,B");

    //set up featured leaderboards
    document.getElementById("featured-leaderboards").innerHTML = "";
    for (let i = leaderboardsData.length - 1; i >= leaderboardsData.length - 3; i--) {
        if (i > 0) {
            createLeaderboardSnapshots(leaderboardsData[i]);
        } else {
            createLeaderboardSnapshots({ name: "Coming Soon", date: "Coming Soon", type: "Coming Soon" });
        }
    }

    //set up upcoming comps
    const upcomingCompsEmptyFiltered = [];
    for (let i = 0; i < upcomingCompsData.length; i++) {
        if (upcomingCompsData[i]["name"] != "") {
            upcomingCompsEmptyFiltered.push(upcomingCompsData[i]);
        }
    }

    upcomingCompsEmptyFiltered.sort((a, b) => new Date(a) - new Date(b));

    document.getElementById("upcoming-comps-list").innerHTML = "";

    for (let i = 0; i < 3; i++) {
        if (i < upcomingCompsEmptyFiltered.length) {
            createUpcomingComp(upcomingCompsEmptyFiltered[i], gymsData);
        } else {
            createUpcomingComp({ name: "Coming Soon", date: "Coming Soon", type: "Coming Soon", gym: "Coming Soon" });
        }
    }
}

function createLeaderboardSnapshots(leaderboardData) {
    let compID = leaderboardData["competition id"];
    let name = leaderboardData["name"];
    let date = leaderboardData["date"];
    let typeNumber = leaderboardData["type"];
    let type = "Coming Soon";
    if (typeNumber == "1") {
        type = "Speed";
    } else if (typeNumber == "2") {
        type = "Skill";
    } else if (typeNumber == "3") {
        type = "Style";
    }

    document.getElementById("featured-leaderboards").innerHTML += `<div class="featured-leaderboard"><h3 class="featured-leaderboard-name">${name}</h3><p class="featured-leaderboard-date"><strong>Date:</strong> ${date}</p><p class="featured-leaderboard-type"><strong>Type:</strong> ${type}</p><button class="view-leaderboard-button" onclick="seeFullLeaderboard(${compID})">View Leaderboard</button></div>`;
}

function createUpcomingComp(upcomingCompData, gymsData) {
    let upcomingCompID = upcomingCompData["upcoming comp id"];
    let name = upcomingCompData["name"];
    let gym;
    let gymID = upcomingCompData["gym id"];
    if (name != "Coming Soon") {
        gym = gymsData[parseInt(gymID) - 1]["gym name"];
    } else {
        gym = "Coming Soon";
    }
    let date = upcomingCompData["date"];
    let typeNumber = upcomingCompData["type"];
    let type = "Coming Soon";
    if (typeNumber == "1") {
        type = "Speed";
    } else if (typeNumber == "2") {
        type = "Skill";
    } else if (typeNumber == "3") {
        type = "Style";
    }

    document.getElementById("upcoming-comps-list").innerHTML += `<div class="upcoming-comp"><h3 class="upcoming-comp-name">${name}</h3><a href="gym.html" onclick="goToGym(${gymID})"><p class="upcoming-comp-info"><strong>Gym:</strong> ${gym}</p></a><p class="upcoming-comp-info"><strong>Type:</strong> ${type}</p><p class="upcoming-comp-info"><strong>Date:</strong> ${date}</p><button class="upcoming-comp-more-info" onclick="upcomingCompMoreInfo(${upcomingCompID})">More Info</button></div>`;
}

function goToGym(gymID) {
    sessionStorage.setItem("gymID", parseInt(gymID));
}