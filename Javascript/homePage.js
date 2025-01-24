//athlete search
const athleteSearchButton = document.getElementById("athlete-search-button");
const athleteSearchBar = document.getElementById("athlete-search-bar");

athleteSearchButton.onclick = searchAthlete;

function searchAthlete() {
    sessionStorage.setItem("athleteName", athleteSearchBar.value);
    location.href = "athletes.html";
}

//upcoming comps 
const allUpcomingCompsButton = document.getElementById("all-upcoming-comps");

allUpcomingCompsButton.onclick = seeFullUpcomingCompsList;

function seeFullUpcomingCompsList() {
    location.href = "upcoming.html";
}

//leaderboards list
const allLeaderboardsButton = document.getElementById("leaderboard-lookup");

allLeaderboardsButton.onclick = seeLeaderboardList;

function seeLeaderboardList() {
    location.href = "leaderboards.html";
}

//see full leaderboard
function seeFullLeaderboard() {
    location.href = "leaderboard.html";
}

//athlete profile
const athleteOfTheMonthButton = document.getElementById("highlighted-athlete-lookup");

athleteOfTheMonthButton.onclick = seeAthleteProfile;

function seeAthleteProfile() {
    location.href = "athleteProfile.html";
}