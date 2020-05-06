import * as views from './views.js';
import {Model} from './model.js';
import {split_hash} from './util.js';

window.addEventListener("modelUpdated", function(e){

    let observations = Model.get_recent_observations(5);
    views.list_recent_observationst_view("Recent Observations",observations);

    let users = Model.get_users();
    views.list_users_leaderboard_view("leaderboard_users", users);
    
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

window.onload = function() {
    // redraw();
    Model.update_users();
    Model.update_observations();
};

function hashChange() {
    let hash = split_hash(window.location.hash);
    if(hash.path === "observations" && hash.id === "166"){
        let user = Model.get_user(4);
        views.user_view("Recent Observations",user);
        }
    }


window.onhashchange = hashChange;
