import * as views from './views.js';
import { Model } from './model.js';
import { split_hash } from './util.js';

window.addEventListener("modelUpdated", function (e) {

    let observations = Model.get_recent_observations(10);
    views.list_recent_observationst_view("Recent Observations", observations);

    let users = Model.get_users();
    let userObservations = [];
    for (let i = 0; i < users.length; i++) {
        //console.log(users[i].id);
        userObservations[i] = Model.get_user_observations(users[i].id);
    }
    let sortedUserObservations = userObservations.slice().sort((a, b) => {
        return b.length - a.length;
    });

    let userID = [];
    for (let i = 0; i < 10; i++) {
        userID[i] = sortedUserObservations[i][0].participant;
    }
    console.log(userID);

    let userLeaderBoard = [];
    for (let i = 0; i < 10; i++) {
        userLeaderBoard[i] = Model.get_user(userID[i]);
    }


    views.list_users_leaderboard_view("leaderboard_users", userLeaderBoard);




});



function redraw() {

    let content = "<h2>API Test</h2><ul>";
    content += "<li><a href='/api/observations'>List of Observations</a></li>";
    content += "<li><a href='/api/users'>List of Users</a></li>";
    content += "<li><a href='/api/users/1'>Detail of one user</a></li>";
    content += "<li><a href='/api/observations/1'>Detail of one observation</a></li>";
    content += "</ul>";

    // update the page
    document.getElementById("target").innerHTML = content;
}

window.onload = function () {
    // redraw();
    Model.update_users();
    Model.update_observations();
};

window.onhashchange = hashChange;

//getting the user when clicking on an observation in recent observations
function hashChange() {
    let hash = split_hash(window.location.hash);
    let path = hash.path;
    let id = parseInt(hash.id);

    if (path == "") {
        let observations = Model.get_recent_observations(10);
        views.list_recent_observationst_view("Recent Observations", observations);

        let users = Model.get_users();
        views.list_users_leaderboard_view("leaderboard_users", users);

    }
    else if (path === "observations") {
        let oneObservation = Model.get_observation(id);

        let user = Model.get_user(oneObservation.participant);

        views.user_view("Recent Observations", user);
    }

}



