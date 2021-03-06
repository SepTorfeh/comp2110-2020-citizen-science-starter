export { Model };

/* 
 * Model class to support the Citizen Science application
 * this class provides an interface to the web API and a local
 * store of data that the application can refer to.
 * The API generates two different events:
 *   "modelChanged" event when new data has been retrieved from the API
 *   "observationAdded" event when a request to add a new observation returns
*/

const Model = {

    observations_url: '/api/observations',
    users_url: '/api/users',

    //these two variables are for checking if observations or users have been updated
    observations_ready: 0,
    users_ready: 0,

    // this will hold the data stored in the model
    data: {
        observations: [],
        users: []
    },

    // update_users - retrieve the latest list of users 
    //    from the server API
    // when the request is resolved, creates a "modelUpdated" event 
    // with the model as the event detail
    update_users: function () {
        fetch(this.users_url)
            .then(
                function (response) {
                    return response.json();
                }
            )
            .then(
                (data) => {
                    this.data.users = data;
                    //setting the users_ready to 1 meaning it has been updated
                    this.users_ready = 1;
                    let event = new CustomEvent("modelUpdated", { detail: this });
                    window.dispatchEvent(event);
                }
            );
    },

    // update_observations - retrieve the latest list of observations
    //   from the server API
    // when the request is resolved, creates a "modelUpdated" event 
    // with the model as the event detail
    update_observations: function () {
        fetch(this.observations_url)
            .then(
                function (response) {
                    return response.json();
                }
            )
            .then(
                (data) => {
                    this.data.observations = data;
                    //setting the observations_ready to 1 meaning it has been updated
                    this.observations_ready = 1;
                    let event = new CustomEvent("modelUpdated", { detail: this });
                    window.dispatchEvent(event);
                }
            );
    },

    // get_observations - return an array of observation objects
    get_observations: function () {
        return this.data.observations;
    },

    // get_observation - return a single observation given its id
    get_observation: function (observationid) {
        let observations = this.data.observations;
        for (let i = 0; i < observations.length; i++) {
            if (parseInt(observations[i].id) === parseInt(observationid))
                return observations[i];
        }
        return [];
    },

    set_observations: function (observations) {
        this.data.observations = observations;
    },

    // add_observation - add a new observation by submitting a request
    //   to the server API
    //   formdata is a FormData object containing all fields in the observation object
    // when the request is resolved, creates an "observationAdded" event
    //  with the response from the server as the detail
    add_observation: function (formdata) {
        fetch(this.observations_url, {
            method: "POST",
            body: formdata
        })
            .then(
                function (response) {
                    return response.json();
                }
            )
            .then(
                (data) => {
                    let event = new CustomEvent("observationAdded", { detail: data });
                    window.dispatchEvent(event);
                }
            );
    },

    // get_user_observations - return just the observations for
    //   one user as an array
    get_user_observations: function (userid) {
        let observations = this.data.observations;
        let userObservations = [];
        let j = 0;
        for (let i = 0; i < observations.length; i++) {
            if (parseInt(observations[i].participant) === parseInt(userid)) {
                userObservations[j] = observations[i];
                j++;
            }
        }
        userObservations = userObservations.slice().sort(function (a, b) {
            return new Date(b.timestamp) - new Date(a.timestamp);
        });
        return userObservations;
    },

    // get_recent_observations - return the N most recent
    //  observations, ordered by timestamp, most recent first
    get_recent_observations: function (N) {
        let observations = this.data.observations;
        let result = [];
        //sorting the observatoins
        observations = observations.slice().sort(function (a, b) {
            return new Date(b.timestamp) - new Date(a.timestamp);
        });
        //taking the first N observations
        for (let i = 0; i < N; i++) {
            result[i] = observations[i];
        }
        return result;
    },

    /* 
    * Users
    */
    // get_users - return the array of users
    get_users: function () {
        return this.data.users;
    },

    // set_users - set the array of users
    set_users: function (users) {
        this.data.users = users;
    },

    // get_user - return the details of a single user given 
    //    the user id
    get_user: function (userid) {
        let users = this.data.users;
        for (let i = 0; i < users.length; i++) {
            if (parseInt(users[i].id) === parseInt(userid))
                return users[i];
        }
        return null;
    },

    //this method sortes the user based on their observation
    //and gives back n users
    userSortForLeaderboard: function (users, n){
        let userObservations = [];
        //getting all of the observations for each user
        for (let i = 0; i < users.length; i++) {
            userObservations[i] = Model.get_user_observations(users[i].id);
        }
        //sort "userObservations" array based on the length
        let sortedUserObservations = userObservations.slice().sort((a, b) => {
            return b.length - a.length;
        });
        //now that we have the sorted observations we get thier id for n users
        let userID = [];
        for (let i = 0; i < n; i++) {
            if (sortedUserObservations[i].length > 0) {
                userID[i] = sortedUserObservations[i][0].participant;
            }
        }
        //now we get top n users based on their observations
        let userLeaderBoard = [];
        for (let i = 0; i < n; i++) {
            userLeaderBoard[i] = Model.get_user(userID[i]);
        }
        return userLeaderBoard;
    }

};
