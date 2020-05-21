import * as views from './views.js';
import { Model } from './model.js';
import { split_hash } from './util.js';

window.addEventListener("modelUpdated", function (e) {
    console.log(e);

    //getting the recent observations
    let observations = Model.get_recent_observations(10);
    views.list_recent_observationst_view("Recent Observations", observations);

    //-------------------------------------------------------------------------

    //getting the top 10 users 
    let users = Model.get_users();
    let userObservations = [];
    //getting all of the observations for each user
    for (let i = 0; i < users.length; i++) {
        userObservations[i] = Model.get_user_observations(users[i].id);
    }
    //sort "userObservations" array based on the length
    console.log(userObservations);

    let sortedUserObservations = userObservations.slice().sort((a, b) => {
        return b.length - a.length;
    });
    //now that we have the sorted observations we get thier id
    let userID = [];
    for (let i = 0; i < 10; i++) {
        if (sortedUserObservations[i].length > 0) {
            userID[i] = sortedUserObservations[i][0].participant;
        }
    }

    //now we get top 10 users based on their observations
    let userLeaderBoard = [];
    for (let i = 0; i < 10; i++) {
        userLeaderBoard[i] = Model.get_user(userID[i]);
    }

    views.list_users_leaderboard_view("leaderboard_users", userLeaderBoard);


    //check for the hash
    let hash = split_hash(window.location.hash);
    let path = hash.path;
    let id = hash.id;
    if (path.match("observations")) {
        if (id === undefined) {
            let observations = Model.get_observations();
            views.list_recent_observationst_view("Recent Observations", observations);
            //setting leaderboard to empty
            document.getElementById("leaderboard_users").innerHTML = "";
        }
    }
    if (path === "users") {
        if (id === undefined) {
            let users = Model.get_users();
            views.list_users_leaderboard_view("leaderboard_users", users);
            //setting leaderboard to empty
            document.getElementById("Recent Observations").innerHTML = "";
        }
        else {
            id = parseInt(hash.id);
            let user = Model.get_user(id);
            let observations = Model.get_user_observations(id);
            views.user_view("Recent Observations", user);
            views.list_recent_observationst_view("leaderboard_users", observations);

        }
    }

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
    let id = hash.id;

    //Home page
    if (path == "") {
        //observations
        let observations = Model.get_recent_observations(10);
        views.list_recent_observationst_view("Recent Observations", observations);
        //--------------------------------------------
        //top 10 users
        let users = Model.get_users();
        let userObservations = [];
        //getting all of the observations for each user
        for (let i = 0; i < users.length; i++) {
            userObservations[i] = Model.get_user_observations(users[i].id);
        }
        //sort "userObservations" array based on the length
        let sortedUserObservations = userObservations.slice().sort((a, b) => {
            return b.length - a.length;
        });
        //now that we have the sorted observations we get thier id
        let userID = [];
        for (let i = 0; i < 10; i++) {
            if (sortedUserObservations[i].length > 0) {
                userID[i] = sortedUserObservations[i][0].participant;
            }
        }
        //now we get top 10 users based on their observations
        let userLeaderBoard = [];
        for (let i = 0; i < 10; i++) {
            userLeaderBoard[i] = Model.get_user(userID[i]);
        }

        views.list_users_leaderboard_view("leaderboard_users", userLeaderBoard);

    }
    //Observations
    else if (path === "observations") {
        if (id === undefined) {
            let observations = Model.get_observations();
            views.list_recent_observationst_view("Recent Observations", observations);
            //setting leaderboard to empty
            document.getElementById("leaderboard_users").innerHTML = "";
        }
        else {
            id = parseInt(hash.id);
            let oneObservation = Model.get_observation(id);

            let user = Model.get_user(oneObservation.participant);

            views.user_view("Recent Observations", user);
            //setting leaderboard to empty
            document.getElementById("leaderboard_users").innerHTML = "";
        }

    }
    //users
    else if (path === "users") {
        if (id === undefined) {
            let users = Model.get_users();
            views.list_users_leaderboard_view("leaderboard_users", users);
            //setting leaderboard to empty
            document.getElementById("Recent Observations").innerHTML = "";
        }
        else {
            id = parseInt(hash.id);
            let user = Model.get_user(id);
            let observations = Model.get_user_observations(id);
            views.user_view("Recent Observations", user);
            views.list_recent_observationst_view("leaderboard_users", observations);

        }
    }

}



