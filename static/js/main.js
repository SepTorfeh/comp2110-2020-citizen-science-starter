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
        Model.update_observations();
        //going to the user 0 page
        window.location.hash = "!/users/0";
    }
});

//checking which page we are on 
window.onhashchange = action.hashChange;



