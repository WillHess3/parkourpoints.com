//go to leaderboards
function viewFullLeaderboard(competitionID) {
    sessionStorage.setItem("competitionID", parseInt(competitionID));
    location.href = "leaderboard.html";
}

//build page
let leaderboardsInfoData;
let gymsData;

document.addEventListener("DOMContentLoaded", buildPage);

async function buildPage() {
    leaderboardsInfoData = await getSheetData("Leaderboards info", "SELECT A,B,C,D,E");
    gymsData = await getSheetData("Gyms", "SELECT A,B");

    document.getElementById("leaderboard-list").innerHTML = "";

    for (let i = leaderboardsInfoData.length - 1; i >= 0; i--) {
        createLeaderboardRow(leaderboardsInfoData[i]);
    }
}

function createLeaderboardRow(leaderboardInfo) {
    let leaderboardID = parseInt(leaderboardInfo["competition id"]);
    let gymID = parseInt(leaderboardInfo["gym id"]);
    let name = leaderboardInfo["name"];
    let gym = gymsData[gymID - 1]["gym name"];
    let date = leaderboardInfo["date"];
    let typeNumber = leaderboardInfo["type"];
    let type;
    if (typeNumber == 1) {
        type = "Speed";
    } else if (typeNumber == 2) {
        type = "Skill";
    } else if (typeNumber == 3) {
        type = "Style";
    }

    document.getElementById("leaderboard-list").innerHTML += `<div class="competition"><h3 class="competition-name">${name}</h3><a href="gym.html" onclick="viewGymProfile(${gymID})"><p class="competition-info"><strong>Gym:</strong> ${gym}</p></a><p class="competition-info"><strong>Date:</strong> ${date}</p><p class="competition-info"><strong>Type:</strong> ${type}</p><button class="view-leaderboard-button" onclick="viewFullLeaderboard(${leaderboardID})">View Leaderboard</button></div>`;
}

//search
function onSearchClicked() {
    let text = document.getElementById("search-bar").value;
    document.getElementById("leaderboard-list").innerHTML = "";

    for (let i = leaderboardsInfoData.length - 1; i >= 0; i--) {
        if (isLooseSubstring(text, leaderboardsInfoData[i]["name"])) {
            createLeaderboardRow(leaderboardsInfoData[i]);
        }
    }
}

function isLooseSubstring(a, b) {
    const normalize = str => str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    return normalize(b).includes(normalize(a));
}

//view gym
function viewGymProfile(gymID) {
    sessionStorage.setItem("gymID", parseInt(gymID));
}