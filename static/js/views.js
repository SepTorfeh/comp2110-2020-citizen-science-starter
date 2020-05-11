export { list_recent_observationst_view, list_users_leaderboard_view, user_view };

// apply_template - apply a template to some data
//  and insert into the page
//  targetid - id of the element to insert content
//  templateid - id of the element containing the template
//  data - data to pass to the template
function apply_template(targetid, templateid, data) {

    let target = document.getElementById(targetid);

    let template = Handlebars.compile(
        document.getElementById(templateid).textContent
    )
    target.innerHTML = template(data);
}

// listUsersView - generate a view of a list of units
//   and insert it at `targetid` in the document
function list_recent_observationst_view(targetid, observations) {
    apply_template(targetid, "recent-observations-list-template", { 'observations': observations });
}

// userView - generate a view of a individual user
//   and insert it at `targetid` in the document
function list_users_leaderboard_view(targetid, users) {
    apply_template(targetid, "leaderboard-users-list-template", { 'users': users });
}

// template for single user view
function user_view(targetid, user) {
    apply_template(targetid, "user-template", user);
}