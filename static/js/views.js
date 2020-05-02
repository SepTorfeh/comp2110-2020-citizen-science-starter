export { listUsersView, userView };

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
function listUsersView(targetid, users) {
    apply_template(targetid, "unit-list-template", {'unit':users});
}

// userView - generate a view of a individual user
//   and insert it at `targetid` in the document
function userView(targetid, user) {
    console.log(unit)
    apply_template(targetid, "individual-unit-template", user);
}