document.addEventListener("DOMContentLoaded", buildPage);

async function buildPage() {
    const upcomingCompsData = await getSheetData("Upcoming competitions", "SELECT A,B,C,D,E,F,G,H,I,J");
    const gymsData = await getSheetData("Gyms", "SELECT A,B");

    const upcomingCompID = getUpcomingCompID();

    let upcomingCompData;
    for (let i = 0; i < upcomingCompsData.length; i++) {
        if (upcomingCompsData[i]["upcoming comp id"] == upcomingCompID) {
            upcomingCompData = upcomingCompsData[i];
        }
    }

    document.getElementById("title").textContent = upcomingCompData["name"];
    document.getElementById("competition-title").textContent = upcomingCompData["name"];

    let gymID = parseInt(upcomingCompData["gym id"]);
    let gymName = gymsData[gymID - 1]["gym name"];
    let date = upcomingCompData["date"];
    let time = upcomingCompData["time"];
    let type;
    let typeNumber = upcomingCompData["type"];
    if (typeNumber == 1) {
        type = "Speed";
    } else if (typeNumber == 2) {
        type = "Skill";
    } else if (typeNumber == 3) {
        type = "Style";
    }
    let format = upcomingCompData["format"];
    let ageDivisions = upcomingCompData["age divisions"];
    let parkourPointMultiplier = upcomingCompData["parkour point multiplier"];

    document.getElementById("gym-link").onclick = viewGymProfile(gymID);
    document.getElementById("gym").innerHTML = `<strong>Gym: </strong>${gymName}`;
    document.getElementById("date").innerHTML = `<strong>Date: </strong>${date}`;
    document.getElementById("date").innerHTML = `<strong>Time: </strong>${time}`;
    document.getElementById("type").innerHTML = `<strong>Type: </strong>${type}`;
    document.getElementById("format").innerHTML = `<strong>Format: </strong>${format}`;
    document.getElementById("age-divisions").innerHTML = `<strong>Age Divisions: </strong>${ageDivisions}`;
    document.getElementById("parkour-point-multiplier").innerHTML = `<strong>Parkour Point Multiplier: </strong>${parkourPointMultiplier}`;
    document.getElementById("sign-up-button").onclick = () => location.href = upcomingCompData["sign up link"];
}

function getUpcomingCompID() {
    let upcomingCompID = sessionStorage.getItem("upcomingCompID");
    if (upcomingCompID == null) {
        upcomingCompID = 1;
    }
    return parseInt(upcomingCompID);
}

function viewGymProfile(gymID) {
    sessionStorage.setItem("gymID", parseInt(gymID));
}