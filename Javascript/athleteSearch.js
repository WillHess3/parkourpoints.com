const searchBar = document.getElementById("athlete-search-bar");

function setSearchBarInitialText() {
    let name = sessionStorage.getItem("athleteName");
    sessionStorage.clear();
    if (name == null) {
        return;
    }

    searchBar.value = name;
}

setSearchBarInitialText();