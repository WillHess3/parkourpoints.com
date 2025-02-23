document.addEventListener("DOMContentLoaded", buildPage);

const athleteID = getAthleteID();

async function buildPage() {
    const athletesData = await getSheetData("Athletes", "SELECT A,B,C,D,E");
    const gymsData = await getSheetData("Gyms", "SELECT A,B");
    const leaderboards = await getSheetData("Leaderboards by age division", "SELECT A,B,C,D,E");
    const leaderboardsInfo = await getSheetData("Leaderboards info", "SELECT A,B,C,D,E,G,H");

    const athleteData = athletesData[parseInt(athleteID) - 1];
    const gym = gymsData[athleteData["gym id"] - 1];
    const attendedCompIDsByAgeDivision = athleteData["competition ids list"].split(",");
    const attendedCompsInfoIDs = attendedCompIDsByAgeDivision.map(id => id.split("-")[0]);

    //basic info
    document.getElementById("title").textContent = athleteData["name"];
    document.getElementById("athlete-name").textContent = athleteData["name"];

    document.getElementById("gym-link").onclick = goToGym(gym["gym id"]);
    document.getElementById("gym").innerHTML = "<strong>Gym:</strong> " + gym["gym name"];
    document.getElementById("parkour-points").innerHTML = "<strong>Parkour Points:</strong> " + athleteData["parkour points"];
    document.getElementById("competitions-attended").innerHTML = "<strong>Competitions Attended:</strong> " + attendedCompIDsByAgeDivision.length;

    //comp history
    for (let i = attendedCompIDsByAgeDivision.length - 1; i >= 0; i--) {
        let compToAdd;
        for (let j = 0; j < leaderboards.length; j++) {
            if (attendedCompIDsByAgeDivision[i] == leaderboards[j]["competition age division id"]) {
                compToAdd = leaderboards[j];
                break;
            }
        }

        createCompHistoryRow(compToAdd, leaderboardsInfo[parseInt(attendedCompsInfoIDs[i]) - 1], gymsData);
    }


}

function getAthleteID() {
    let ID = sessionStorage.getItem("athleteID");
    return ID;
}

function createCompHistoryRow(leaderboardAgeDivisionData, leaderboardInfoData, gymsData) {
    //info
    let leaderboardID = leaderboardInfoData["competition id"];
    let compName = leaderboardInfoData["name"];
    let typeNumber = leaderboardInfoData["type"];
    let type;
    if (typeNumber == 1) {
        type = "Speed";
    } else if (typeNumber == 2) {
        type = "Skill";
    } else if (typeNumber == 3) {
        type = "Style";
    }
    let date = leaderboardInfoData["date"];
    let gymID = parseInt(leaderboardInfoData["gym id"]);
    let gym = gymsData[gymID - 1]["gym name"];

    //scores
    let athletesCompeted = leaderboardAgeDivisionData["athlete id list"].split(",");
    let round1Scores = leaderboardAgeDivisionData["round 1 score list"].split(",");
    let round2Scores = leaderboardAgeDivisionData["round 2 score list"].split(",");
    let round3Scores = leaderboardAgeDivisionData["round 3 score list"].split(",");

    let competitiors = [];
    for (let i = 0; i < athletesCompeted.length; i++) {
        competitiors.push({ id: athletesCompeted[i], round1: round1Scores[i], round2: round2Scores[i], round3: round3Scores[i], finalScore: Math.round((parseFloat(round1Scores[i]) + parseFloat(round2Scores[i]) + parseFloat(round3Scores[i])) * 1000) / 1000 });
    }

    if (typeNumber == "1") {
        competitiors.sort((a, b) => a["finalScore"] - b["finalScore"]);
    } else {
        competitiors.sort((a, b) => b["finalScore"] - a["finalScore"]);
    }

    let place;
    for (let i = 0; i < competitiors.length; i++) {
        if (competitiors[i]["id"] == athleteID) {
            place = i + 1;
            break;
        }
    }

    let percentile = Math.round((1 - ((place - 1) / competitiors.length)) * 100);
    let ageDivisionIndex = leaderboardAgeDivisionData["competition age division id"].split("-")[1];
    let ageDivision = leaderboardInfoData["age divisions"].split(",")[parseInt(ageDivisionIndex)];
    let round1Score = competitiors[place - 1]["round1"];
    let round2Score = competitiors[place - 1]["round2"];;
    let round3Score = competitiors[place - 1]["round3"];;
    let finalScore = competitiors[place - 1]["finalScore"];;
    let parkourPointsEarned = 1;
    if (place == 1) {
        parkourPointsEarned = 15;
    } else if (place == 2) {
        parkourPointsEarned = 10;
    } else if (place == 3) {
        parkourPointsEarned = 5;
    } else if (percentile >= 50) {
        parkourPointsEarned = 2;
    }
    parkourPointsEarned *= parseInt(leaderboardInfoData["parkour point multiplier"]);
    document.getElementById("comp-history-table-tbody").innerHTML += `<tr class="competition-data-row"><td><a href="leaderboard.html" onclick="seeFullLeaderboard(${leaderboardID})">${compName}</a></td><td>${type}</td><td>${date}</td><td><a href="gym.html" onclick="goToGym(${gymID})">${gym}</a></td><td>${place}</td><td>${percentile}</td><td>${ageDivision}</td><td>${round1Score}</td><td>${round2Score}</td><td>${round3Score}</td><td>${finalScore}</td><td>${parkourPointsEarned}</td></tr>`;
}

function goToGym(gymID) {
    sessionStorage.setItem("gymID", parseInt(gymID));
}

function seeFullLeaderboard(leaderboardID) {
    sessionStorage.setItem("leaderboardID", leaderboardID);
}