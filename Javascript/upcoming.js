//see full upcoming comp
function seeFullComp(upcomingCompID) {
    sessionStorage.setItem("upcomingCompID", parseInt(upcomingCompID));
    location.href = "upcomingCompetition.html";
}

//see gym profile
function viewGymProfile(gymID) {
    sessionStorage.setItem("gymID", parseInt(gymID));
}

//build page
let upcomingCompsData;
let gymsData;

document.addEventListener("DOMContentLoaded", buildPage);

async function buildPage() {
    upcomingCompsData = await getSheetData("Upcoming competitions", "SELECT A,B,C,D,F");
    gymsData = await getSheetData("Gyms", "SELECT A,B");

    document.getElementById("upcoming-comps-list").innerHTML = "";

    upcomingCompsData.sort((a, b) => new Date(a["date"]) - new Date(b["date"]));

    for (let i = 0; i < upcomingCompsData.length; i++) {
        createUpcomingCompRow(upcomingCompsData[i]);
    }
}

function createUpcomingCompRow(upcomingCompData) {
    if (upcomingCompData["upcoming comp id"] == "") {
        return;
    }

    let upcomingCompID = parseInt(upcomingCompData["upcoming comp id"])
    let gymID = parseInt(upcomingCompData["gym id"]);
    let name = upcomingCompData["name"];
    let gym = gymsData[gymID - 1]["gym name"];
    let typeNumber = upcomingCompData["type"];
    let type;
    if (typeNumber == 1) {
        type = "Speed";
    } else if (typeNumber == 2) {
        type = "Skill";
    } else if (typeNumber == 3) {
        type = "Style";
    }
    let date = upcomingCompData["date"];

    document.getElementById("upcoming-comps-list").innerHTML += `<div class="upcoming-comp"><h3 class="upcoming-comp-name">${name}</h3><a href="gym.html" onclick="viewGymProfile(${gymID})"><p class="upcoming-comp-info"><strong>Gym:</strong> ${gym}</p></a><p class="upcoming-comp-info"><strong>Type:</strong> ${type}</p><p class="upcoming-comp-info"><strong>Date:</strong> ${date}</p><button class="upcoming-comp-more-info" onclick="seeFullComp(${upcomingCompID})">More Info</button></div>`;
}