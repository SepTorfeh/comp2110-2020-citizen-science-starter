export {hashChange};
import { Model } from './model.js';
import * as views from './views.js';
import { split_hash } from './util.js';

//checking for the hash
function hashChange() {
    let hash = split_hash(window.location.hash);
    let path = hash.path;
    let id = hash.id;

    //Home page
    if (path == "") {
        //recent observations
        //getting the 10 recent observations
        let observations = Model.get_recent_observations(10);
        views.list_recent_observationst_view("recent_observations", observations);
        //--------------------------------------------
        //getting the users
        let users = Model.get_users();
        //getting the top 10 users 
        let userLeaderBoard = Model.userSortForLeaderboard(users, 10);
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
            //getting the observation
            let oneObservation = Model.get_observation(id);
            //getting the user whos done the observation 
            let user = Model.get_user(parseInt(oneObservation.participant));
            //viewing the user
            views.user_view("recent_observations", user);
            //viewing the observation
            views.observation_view("leaderboard_users", oneObservation);  
        }
    }
    //users
    else if (path === "users") {
        if (id === undefined) {
            let users = Model.get_users();
            //sorting the users and getting all of the users
            let userLeaderBoard = Model.userSortForLeaderboard(users, users.length);
            views.list_users_view("leaderboard_users", userLeaderBoard);
            //setting leaderboard to empty
            document.getElementById("recent_observations").innerHTML = "";
        }
        else {
            id = parseInt(hash.id);
            let user = Model.get_user(id);
            //getting all of the observations for the user
            let observations = Model.get_user_observations(id);
            //viewing the user
            views.user_view("recent_observations", user);
            //viewing all of the observations done by that user
            views.list_recent_observationst_view("leaderboard_users", observations);
        }
    }
    //submit
    else if(path === "submit"){
        //viewing the form
        views.submit_view("leaderboard_users");
        document.getElementById("recent_observations").innerHTML = "";
        
       
        let form = document.getElementById("form");
        //handeling the form submition
        form.onsubmit = observationFormHandeler;
    }
}

//for handeling the form submition
function observationFormHandeler() {
    //getting the span for each warning  
    let location = document.getElementById("location_requirement");
    let temperature = document.getElementById("temperature_requirement");
    let hight =  document.getElementById("height_requirement");
    let girth = document.getElementById("girth_requirement");
    //creating a FormDate object from the form that we submit on the website
    let formdata = new FormData(this);
    //getting the value of the required inputs
    let locationValue = formdata.get("location");
    let temperatureValue = formdata.get("temperature");
    let hightValue = formdata.get("height");
    let girthValue = formdata.get("girth");
    //checking if any field has not been filled
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
        //if all the fields are complete, we can add the observation
        Model.add_observation(formdata);
    }
    //returning false so the page won't refresh
    return false;
}
