import { Model } from './model.js';
import * as action from './action.js';

window.onload = function () {
    Model.update_users();
    Model.update_observations();    
};

//checking to see if modelUpdated has happend
window.addEventListener("modelUpdated", function (e) {
    //checking if both users and observations have been fetched then draw anything on the page
    if(Model.observations_ready === 1 && Model.users_ready === 1){
        //check for the hash
        action.hashChange();
    }
});

//this is for when the form has been submitted
window.addEventListener("observationAdded", function(e){
    //check if the form successfully has been added to the API
    if(e.detail.status === "success"){
        //updating the observations
        Model.update_observations();

        //getting the user who made the observation
        //but at this stage of the project
        //we just use user "0" for new observations
        let user = e.detail.observation.participant;
        
        //going to the user page
        window.location.hash = "!/users/"+user;
    }
});

//checking which page we are on 
window.onhashchange = action.hashChange;



