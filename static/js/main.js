import * as views from './views.js';
import { Model } from './model.js';
import { split_hash } from './util.js';
import * as action from './action.js';

window.onload = function () {
    // redraw();
    Model.update_users();
    Model.update_observations();    
};

window.addEventListener("modelUpdated", function (e) {
    //getting the recent observations
    let observations = Model.get_recent_observations(10);
    views.list_recent_observationst_view("recent_observations", observations);
    //-------------------------------------------------------------------------
    
    //getting the users
    let users = Model.get_users();
    //getting the top 10 users 
    let userLeaderBoard = action.userSortForLeaderboard(users, 10);
    //viewing the leaderboard
    views.list_users_leaderboard_view("leaderboard_users", userLeaderBoard);
    //----------------------------------------------------------------------
    
    //check for the hash
    action.hashChange();

});

window.onhashchange = action.hashChange;


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


