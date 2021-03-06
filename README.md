# COMP2110/6110 - Citizen Science Web Application

This is a Web Application assignment for COMP2120/6110 2020. It contains a 
Python based web server that provides a JSON API to the data required for
the application.  You can run the Python server with the command:

```
python main.py
``` 
This requires Python 3 and the bottle library, I've included bottle with this project
so you should not need to download anything other than Python 3. 

The server will listen for requests on [http://localhost:8010](http://localhost:8010/). 

The main page of the application is generated by the Python code from the file `index.html` 
in the `views` folder. We are using "handlebars templates" (https://handlebarsjs.com/guide/) to generate each view.
If you rename the file, the server won't know where to find it, so don't.

Static files are served from the `static` folder.  You will see sub-folders for CSS, Javascript
and images.   If you want to refer to one of these files in your HTML, use a URL 
like `/static/js/main.js` or `/static/css/style.css`.  The leading `/` is important.  You can
add any other sub-folders you might want under the `static` folder and it will be served
by the application.

There are 5 Javascript files in the project:
* `main.js` is the main entry point and is referenced from the `index.html` file
* `model.js` contains the Model object and its methods (like get_users, get_observations, ...)
* `util.js` provides a utility function for spliting the hash, so we can check which page we are on
* `views.js` contains functions for inserting the handlebar templates into the html when it is needed
* `action.js` contains hashChange and observationFormHandeler functions, so we can check which page we are at and also update the page if needed

The `cypress` directory contains tests to be run with the [Cypress](https://cypress.io) testing tool.

## How does it work

The first thing that we do is on `main.js` when window is loaded we call `update_users()` and `update_observations()` from `model.js`
so that we can get the data from API. When the fetch is completed, we creat an event called "modelUpdated".
So now on `main.js` we listen for "modelUpdated" but because we have 2 sets of data to fetch, one of them would happen faster than the other.
So for that matter I have added `observations_ready` and `users_ready` to the Model object so that we can determine wheather they have been updated or not.
Once we make sure both observation and user have been updated, then we call `hashChange()` function from `action.js`.

In `hashChange()` function we are checking what is the url and base on the url we get the data that we need from Model and then by using handlebar templates and functions from `view.js` we can insert the html that we want into the page.

On `main.js` we always listen to hash changes so we can update the page accordingly.

There is another event listener on `main.js` for when we submit a form.
When we click on submit, in `action.js` `observationFormHandeler()` function will first check if the required inputs are filled.
For checking that and also for later when we want to pass the form as the body for fetch, we are using `FormData object` which makes it much easier.
we can call `get()` on a FormData object and get the value for specific key on the form.
If the required fields are not filled then we show a warning message. When all the inputs are filled, we call `add_observation()` from Model and we pass the FormData object.
Then `add_observation()` function will fetch that form as a FormData object as its body with POST method to our API.
The timestamp and id are autogenerated by the server for a new observation.
Then when "observationAdded" event happends on `main.js`, we will first check the status of the fetch, if it has been successfull, then we update the observations and then we change the hash to the user who has done the submission (in this project for now just user 0 can submit new observations).

## The API Server

The Python API server provides the following URLs serving JSON data:

* `/api/users` - GET returns a JSON array of user details
* `/api/users/<id>` - GET returns details of an individual user
* `/api/observations` - GET returns a JSON array of observation records
* `/api/observations` - POST adds a new observation record (required fields below)
* `/api/observations/<id>` - GET returns details of an individual observation
* `/api/reset` - GET request resets the database (for testing purposes)

