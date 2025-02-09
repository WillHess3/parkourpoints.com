const competitionID = getCompetitionID();

function getCompetitionID() {
    let id = sessionStorage.getItem("competitionID");
    return id;
}

document.addEventListener("DOMContentLoaded", buildPage);

async function buildPage() {
    const leaderboardsInfoData = await getSheetData("Leaderboards info", "SELECT A,B,C,D,E,F,G,H,I");
    const gymsData = await getSheetData("Gyms", "SELECT A,B");
    const leaderboardsByAgeDivisionData = await getSheetData("Leaderboards by age division", "SELECT A,B,C,D,E");
    const athletesData = await getSheetData("Athletes", "SELECT A,B,C");

    const leaderboardInfoData = leaderboardsInfoData[parseInt(competitionID) - 1];

    document.getElementById("title").textContent = leaderboardInfoData["name"];
    document.getElementById("leaderboard-title").textContent = leaderboardInfoData["name"];

    let gymID = parseInt(leaderboardInfoData["gym id"]);
    document.getElementById("host-gym-link").onclick = viewGymProfile(gymID);
    document.getElementById("gym").innerHTML = "<strong>Gym: </strong>" + gymsData[gymID - 1]["gym name"];
    document.getElementById("date").innerHTML = "<strong>Date: </strong>" + leaderboardInfoData["date"];

    const typeNumber = leaderboardInfoData["type"];
    let type;
    if (typeNumber == 1) {
        type = "Speed";
    } else if (typeNumber == 2) {
        type = "Skill";
    } else if (typeNumber == 3) {
        type = "Style";
    }

    document.getElementById("type").innerHTML = "<strong>Type: </strong>" + type;
    document.getElementById("format").innerHTML = "<strong>Format: </strong>" + leaderboardInfoData["format"];

    let competitiorCount = 0;
    for (let i = 0; i < leaderboardsByAgeDivisionData.length; i++) {
        if (leaderboardsByAgeDivisionData[i]["competition age division id"].split("-")[0] == competitionID) {
            competitiorCount += leaderboardsByAgeDivisionData[i]["athlete id list"].split(",").length;

            createLeaderboard(leaderboardsByAgeDivisionData[i], leaderboardInfoData, athletesData, gymsData);
        }
    }

    document.getElementById("number-of-competitors").innerHTML = "<strong>Competitors: </strong>" + competitiorCount;
    document.getElementById("age-divisions").innerHTML = "<strong>Age Divisions: </strong>" + leaderboardInfoData["age divisions"];
    document.getElementById("parkour-point-multiplier").innerHTML = "<strong>Parkour Point Multiplier: </strong>" + leaderboardInfoData["parkour point multiplier"];

    document.getElementById("highlights-button").onclick = () => location.href = leaderboardInfoData["highlights link"];
}

function createLeaderboard(leaderboard, leaderboardInfoData, athletesData, gymsData) {
    let ageDivisionIndex = parseInt(leaderboard["competition age division id"].split("-")[1]);
    let ageDivision = leaderboardInfoData["age divisions"].split(",")[ageDivisionIndex];
    let allDataRows = getAllDataRowsAsStrings(leaderboard, leaderboardInfoData, athletesData, gymsData);

    document.getElementById("leaderboard").innerHTML += `<h3 class="leaderboard-age-division">${ageDivision}</h3><div class="scrollable-table"><table><tr><th>Place</th><th>Athlete Name</th><th>Athlete Gym</th><th>Round 1</th><th>Round 2</th><th>Round 3</th><th>Final Score</th><th>Parkour Points Earned</th></tr>${allDataRows}</table></div>`;
}

function getAllDataRowsAsStrings(leaderboard, leaderboardInfo, athletesData, gymsData) {
    let athleteIDs = leaderboard["athlete id list"].split(",");

    let round1Scores = leaderboard["round 1 score list"].split(",");
    let round2Scores = leaderboard["round 2 score list"].split(",");
    let round3Scores = leaderboard["round 3 score list"].split(",");

    let competitiors = [];
    for (let i = 0; i < athleteIDs.length; i++) {
        competitiors.push({
            athleteID: athleteIDs[i],
            athleteName: athletesData[parseInt(athleteIDs[i]) - 1]["name"],
            athleteGymID: athletesData[parseInt(athleteIDs[i]) - 1]["gym id"],
            athleteGym: gymsData[parseInt(athletesData[parseInt(athleteIDs[i]) - 1]["gym id"]) - 1]["gym name"],
            round1Score: round1Scores[i],
            round2Score: round2Scores[i],
            round3Score: round3Scores[i],
            finalScore: Math.round((parseFloat(round1Scores[i]) + parseFloat(round2Scores[i]) + parseFloat(round3Scores[i])) * 1000) / 1000
        });
    }

    if (leaderboardInfo["type"] == 1) {
        competitiors.sort((a, b) => a["finalScore"] - b["finalScore"]);
    } else {
        competitiors.sort((a, b) => b["finalScore"] - a["finalScore"]);
    }

    let dataRowsAsString = "";
    for (let i = 0; i < competitiors.length; i++) {
        let parkourPointsEarned = 1;
        if (i == 0) {
            parkourPointsEarned = 15;
        } else if (i == 1) {
            parkourPointsEarned = 10;
        } else if (i == 2) {
            parkourPointsEarned = 5;
        } else if (1 - i / competitiors.length >= .5) {
            parkourPointsEarned = 2;
        }

        parkourPointsEarned *= parseInt(leaderboardInfo["parkour point multiplier"]);

        dataRowsAsString += `<tr class="leaderboard-data-row"><td>${i + 1}</td><td><a href="athleteProfile.html" onclick="viewAthleteProfile(${competitiors[i].athleteID})">${competitiors[i].athleteName}</a></td><td><a href="gym.html" onclick="viewGymProfile(${competitiors[i].athleteGymID})">${competitiors[i].athleteGym}</a></td><td>${competitiors[i].round1Score}</td><td>${competitiors[i].round2Score}</td><td>${competitiors[i].round3Score}</td><td>${competitiors[i].finalScore}</td><td>${parkourPointsEarned}</td></tr>`;
    }

    return dataRowsAsString;
}

function viewGymProfile(gymID) {
    sessionStorage.setItem("gymID", parseInt(gymID));
}

function viewAthleteProfile(athleteID) {
    sessionStorage.setItem("athleteID", parseInt(athleteID));
}