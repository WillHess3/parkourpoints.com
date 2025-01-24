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

//leaderboards
const allLeaderboardsButton = document.getElementById("leaderboard-lookup");

allLeaderboardsButton.onclick = seeLeaderboardList;

function seeLeaderboardList() {
    location.href = "leaderboards.html";
}