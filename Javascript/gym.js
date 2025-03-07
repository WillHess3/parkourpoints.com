//leaderboards
function viewFullLeaderboard(competitionID) {
    sessionStorage.setItem("competitionID", parseInt(competitionID));
    location.href = "leaderboard.html";
}

//athlete
function viewAthleteProfile(athleteID) {
    sessionStorage.setItem("athleteID", parseInt(athleteID));
    location.href = "athleteProfile.html";
}

//upcoming comps
function viewFullUpcomingComp(upcomingCompID) {
    sessionStorage.setItem("upcomingCompID", parseInt(upcomingCompID));
    location.href = "upcomingCompetition.html";
}

//building the page
document.addEventListener("DOMContentLoaded", buildGymPage);

let gymWebsite;
let gymName;
let gymID;

async function buildGymPage() {
    const gymsData = await getSheetData("Gyms", "SELECT A,B,C,D,E,F");
    const leaderboardsData = await getSheetData("Leaderboards info", "SELECT A,B,C,D,E,F,G,H,I");
    const athletesData = await getSheetData("Athletes", "SELECT A,B,C,D,E");
    const upcomingCompsData = await getSheetData("Upcoming competitions", "SELECT A,B,C,D,F");

    gymID = getGymID();

    const gymInfo = gymsData[gymID - 1];
    const hostedCompetitions = getHostedComps(leaderboardsData);
    const affiliatedAthletes = getAffiliatedAthletes(athletesData);
    const upcomingComps = getUpcomingCompetitions(upcomingCompsData);

    gymName = gymInfo["gym name"];
    gymWebsite = gymInfo["website"];

    document.getElementById("title").textContent = gymName;
    document.getElementById("gym-title").textContent = gymName;

    document.getElementById("location").innerHTML = "<strong>Location:</strong> " + gymInfo["location"];
    document.getElementById("competitions-hosted").innerHTML = "<strong>Competitions Hosted:</strong> " + hostedCompetitions.length;
    document.getElementById("affiliated-athletes").innerHTML = "<strong>Affiliated Athletes:</strong> " + gymInfo["affiliated athletes id list"].split(",").length;
    document.getElementById("website").innerHTML = "<strong>Website: </strong>" + gymWebsite;
    document.getElementById("website-link").href = gymWebsite;
    document.getElementById("gym-picture").src = gymInfo["gym picture"];

    for (let i = 0; i < hostedCompetitions.length; i++) {
        createLeaderboard(hostedCompetitions[i]);
    }

    for (let i = 0; i < affiliatedAthletes.length; i++) {
        createAthlete(affiliatedAthletes[i]);
    }

    for (let i = 0; i < upcomingComps.length; i++) {
        createUpcomingComp(upcomingComps[i]);
    }
}

function getGymID() {
    let gymID = sessionStorage.getItem("gymID");
    
    return gymID;
}

function getHostedComps(leaderboardsData) {
    let hostedComps = [];
    for (let i = 0; i < leaderboardsData.length; i++) {
        if (leaderboardsData[i]["gym id"] == `${gymID}`) {
            hostedComps.push(leaderboardsData[i]);
        }
    }

    return hostedComps;
}

function goToGymWebsite() {
    location.href = gymWebsite;
}

function createLeaderboard(competition) {
    let competitionID = competition["competition id"];
    let name = competition["name"];
    let gym = gymName;
    let date = competition["date"];
    let typeNumber = competition["type"];
    let type;
    if (typeNumber === "1") {
        type = "Speed";
    } else if (typeNumber === "2") {
        type = "Skill";
    } else if (typeNumber === "3") {
        type = "Style";
    }

    document.getElementById("leaderboard-list").innerHTML += `<div class="list-entry competition"><h3 class="entry-name competition-name">${name}</h3><p class="entry-info competition-info"><strong>Date:</strong> ${date}</p><p class="entry-info competition-info"><strong>Type:</strong> ${type}</p><button class="entry-button view-leaderboard-button" onclick="viewFullLeaderboard(${competitionID})">View Leaderboard</button></div>`;
}

function getAffiliatedAthletes(athletesData) {
    let affiliatedAthletes = [];
    for (let i = 0; i < athletesData.length; i++) {
        if (athletesData[i]["gym id"] == gymID) {
            affiliatedAthletes.push(athletesData[i]);
        }
    }

    return affiliatedAthletes.sort((a, b) => b["parkour points"] - a["parkour points"]);
}

function createAthlete(athlete) {
    let athleteID = athlete["athlete id"];
    let name = athlete["name"];
    let parkourPoints = athlete["parkour points"];

    document.getElementById("affiliated-athletes-list").innerHTML += `<div class="list-entry athlete"><h3 class="entry-name athlete-name">${name}</h3><p class="entry-info athlete-info"><strong>Parkour Points:</strong> ${parkourPoints}</p><button class="entry-button view-stats-button" onclick="viewAthleteProfile(${athleteID})">View Stats</button></div>`;
}

function getUpcomingCompetitions(upcomingCompsData) {
    let upcomingComps = [];
    for (let i = 0; i < upcomingCompsData.length; i++) {
        if (upcomingCompsData[i]["gym id"] == gymID) {
            upcomingComps.push(upcomingCompsData[i]);
        }
    }

    return upcomingComps;
}

function createUpcomingComp(upcomingComp) {
    let upcomingCompID = upcomingComp["upcoming comp id"];
    let name = upcomingComp["name"];
    let date = upcomingComp["date"];
    let typeNumber = upcomingComp["type"];
    let type;
    if (typeNumber === "1") {
        type = "Speed";
    } else if (typeNumber === "2") {
        type = "Skill";
    } else if (typeNumber === "3") {
        type = "Style";
    }

    document.getElementById("upcoming-comps-list").innerHTML += `<div class="list-entry upcoming-comp"><h3 class="entry-name upcoming-comp-name">${name}</h3><p class="entry-info upcoming-comp-info"><strong>Type:</strong> ${type}</p><p class="entry-info upcoming-comp-info"><strong>Date:</strong> ${date}</p><button class="entry-button upcoming-comp-more-info" onclick="viewFullUpcomingComp(${upcomingCompID})">More Info</button></div>`;
}