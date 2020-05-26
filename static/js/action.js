export {userSortForLeaderboard, hashChange};
import { Model } from './model.js';
import * as views from './views.js';
import { split_hash } from './util.js';


//sorting the users based on their observation
function userSortForLeaderboard(users, n) {
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
    for (let i = 0; i < n; i++) {
        if (sortedUserObservations[i].length > 0) {
            userID[i] = sortedUserObservations[i][0].participant;
        }
    }

    //now we get top 10 users based on their observations
    let userLeaderBoard = [];
    for (let i = 0; i < n; i++) {
        userLeaderBoard[i] = Model.get_user(userID[i]);
    }
    return userLeaderBoard;
}

//-----------------------------------------------------------------------------------

//checking for the hash
function hashChange() {
    let hash = split_hash(window.location.hash);
    let path = hash.path;
    let id = hash.id;

    //Home page
    if (path == "") {
        //recent observations
        let observations = Model.get_recent_observations(10);
        views.list_recent_observationst_view("recent_observations", observations);
        //--------------------------------------------
        //getting the users
        let users = Model.get_users();
        //getting the top 10 users 
        let userLeaderBoard = userSortForLeaderboard(users, 10);
        //viewing the leaderboard
        views.list_users_leaderboard_view("leaderboard_users", userLeaderBoard);
    }
    //Observations
    else if (path === "observations") {
        if (id === undefined) {
            let observations = Model.get_observations();
            views.list_observationst_view("recent_observations", observations);
            //setting leaderboard to empty
            document.getElementById("leaderboard_users").innerHTML = "";
        }
        else {
            id = parseInt(hash.id);
            let oneObservation = Model.get_observation(id);

            let user = Model.get_user(parseInt(oneObservation.participant));

            views.user_view("recent_observations", user);
            
            views.observation_view("leaderboard_users", oneObservation);  
        }
    }
    //users
    else if (path === "users") {
        if (id === undefined) {
            let users = Model.get_users();
            views.list_users_leaderboard_view("leaderboard_users", users);
            //setting leaderboard to empty
            document.getElementById("recent_observations").innerHTML = "";
        }
        else {
            id = parseInt(hash.id);
            let user = Model.get_user(id);
            let observations = Model.get_user_observations(id);
            views.user_view("recent_observations", user);
            views.list_recent_observationst_view("leaderboard_users", observations);
        }
    }
    //submit
    else if(path === "submit"){
        views.submit_view("recent_observations");
        document.getElementById("leaderboard_users").innerHTML = "";
        //handeling the form submition
        let form = document.getElementById("form");
    
        form.onsubmit = observationFormHandeler;
    }
}

function observationFormHandeler() {  
    let location = document.getElementById("location_requirement");
    let temperature = document.getElementById("temperature_requirement");
    let hight =  document.getElementById("height_requirement");
    let girth = document.getElementById("girth_requirement");

    let formdata = new FormData(this);

    let locationValue = formdata.get("location");
    let temperatureValue = formdata.get("temperature");
    let hightValue = formdata.get("height");
    let girthValue = formdata.get("girth");
    //checking if any field is not been filled
    if((locationValue === "") || (temperatureValue === "") || (hightValue === "") || (girthValue === "")){
       
        if(locationValue === ""){
            location.innerHTML = "Missing required field: location";
        } else{
            location.innerHTML = "";
        }

        if(temperatureValue === ""){
            temperature.innerHTML = "Missing required field: temperature";
        } else{
            temperature.innerHTML = "";
        }

        if(hightValue === ""){
            hight.innerHTML = "Missing required field: height";
        } else{
            hight.innerHTML = "";
        }

        if(girthValue === ""){
            girth.innerHTML = "Missing required field: girth";
        } else{
            girth.innerHTML = "";
        }

    } else{
        location.innerHTML = "";
        temperature.innerHTML = "";
        hight.innerHTML = "";
        girth.innerHTML = "";
        Model.add_observation(formdata);
    }
 
    return false;
}