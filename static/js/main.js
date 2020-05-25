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
    //getting the 10 recent observations
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

window.addEventListener("observationAdded", function(e){
    if(e.detail.status === "success"){
        Model.update_observations();
        //going to the user 0 page
        window.location.hash = "!/users/0";
    }
});

window.onhashchange = action.hashChange;



